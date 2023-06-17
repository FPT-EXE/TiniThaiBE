import crypto from 'crypto';

import qs from 'qs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BootConfigService } from '../../application/configuration/boot.config';
import { formatYYYYMMDDHHMMSS, sortObject } from '../../application/utils';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Course } from '../courses/entities/course.entity';
import { PurchasedCourseService } from '../courses/services/purchased-course.service';
import { CoursesService } from '../courses/services/courses.service';
import { PurchasedCourse } from '../courses/entities/purchased-course.entity';

import {
	VnpTransactionParams,
	VnpIpnParams,
	VnpParams,
	VnpPaymentResponse,
	VnpResCode,
	PaymentStatus,
	CreateTransactionParams,
} from './types';
import { Payment, PaymentDocument } from './entities/payment.entity';


type CreatePaymentParam = {
	courseIds: string[],
	ipAddress: string,
	userId: string,
};

@Injectable()
export class VnPayService {
	constructor(
		private readonly _configSvc: BootConfigService,
		private readonly _userSvc: UsersService,
		private readonly _coursesSvc: CoursesService,
		private readonly _purchasedCourseSvc: PurchasedCourseService,
		@InjectModel(Payment.name) private readonly _paymentModel: Model<Payment>,
	) {}

	public async createPaymentUrl({
		courseIds,
		ipAddress,
		userId
	}: CreatePaymentParam): Promise<string> {
		const {
			date,
			_id: orderId,
			content: orderInfo,
			amount
		} = await this._storePaymentRequest(courseIds, userId);
		const vnpUrl = this._configSvc.VNP_URL;
		const secretKey = this._configSvc.VNP_HASHSECRET;
		const transactionParams = sortObject(
			this._createTransactionParams({
				amount,
				ipAddress,
				date,
				orderInfo,
				orderId: orderId.toString(),
			}),
		);
		const vnpParams: VnpParams = {
			vnp_SecureHash: this._signHashKey(transactionParams, secretKey),
			...transactionParams,
		};
		const url = vnpUrl + '?' + qs.stringify(vnpParams, { encode: false });
		return url;
	}

	public vnpReturn(inpParams: VnpIpnParams): VnpPaymentResponse {
		const isValid = this._validateCheckSum(inpParams);
		if (!isValid) {
			throw new InternalServerErrorException('Checksum failed');
		}
		return { vnpResCode: VnpResCode.Success, message: 'Payment success' };
	}

	public async vnpIpn(inpParams: VnpIpnParams): Promise<VnpPaymentResponse> {
		const isValid = this._validateCheckSum(inpParams);
		const { vnp_ResponseCode: vnpResCode } = inpParams;
		let result: VnpPaymentResponse = {
			vnpResCode: VnpResCode.ChecksumFailed,
			message: 'Fail for checksum',
		};
		if (!isValid) {
			await this._updatePaymentStatus(inpParams, 'Fail for checksum');
			return result;
		}
		switch (vnpResCode) {
			case VnpResCode.Success:
				await this._updatePaymentStatus(inpParams);
				result = {
					vnpResCode: VnpResCode.Success,
					message: 'Success',
				};
				break;
			case VnpResCode.InvalidMerchant:
				await this._updatePaymentStatus(inpParams, 'InvalidMerchant');
				result = {
					vnpResCode: VnpResCode.InvalidMerchant,
					message: 'InvalidMerchant',
				};
				break;
			case VnpResCode.InvalidAmount:
				await this._updatePaymentStatus(inpParams, 'InvalidAmount');
				result = {
					vnpResCode: VnpResCode.InvalidAmount,
					message: 'InvalidAmount',
				};
				break;
			case VnpResCode.InvalidOrder:
				await this._updatePaymentStatus(inpParams, 'InvalidOrder');
				result = {
					vnpResCode: VnpResCode.InvalidOrder,
					message: 'InvalidOrder',
				};
				break;
		}
		return result;
	}

	private _validateCheckSum(inpParams: VnpIpnParams): boolean {
		let isValid = true;
		const secureHash = inpParams.vnp_SecureHash;
		delete inpParams.vnp_SecureHash;
		delete inpParams.vnp_SecureHashType;
		inpParams = sortObject(inpParams);

		const secretKey = this._configSvc.VNP_HASHSECRET;
		const signData  = qs.stringify(inpParams, { encode: false });
		const hmac      = crypto.createHmac('sha512', secretKey);
		const signed    = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

		if (secureHash !== signed) {
			isValid = false;
		}
		return isValid;
	}

	private _signHashKey(
		transactionParams: VnpTransactionParams,
		secretKey: string,
	): string {
		const signData = qs.stringify(transactionParams, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
		return signed;
	}

	private _createTransactionParams(
		params: CreateTransactionParams,
	): VnpTransactionParams {
		const createDate = formatYYYYMMDDHHMMSS(new Date());
		return {
			vnp_Version   : '2.1.0',
			vnp_Command   : 'pay',
			vnp_Locale    : 'vn',
			vnp_CurrCode  : 'VND',
			vnp_IpAddr    : params.ipAddress,
			vnp_TxnRef    : params.orderId,
			vnp_Amount    : params.amount * 100,
			vnp_OrderInfo : params.orderInfo,
			vnp_CreateDate: createDate,
			vnp_TmnCode   : this._configSvc.VNP_TMNCODE,
			vnp_ReturnUrl : this._configSvc.VNP_RETURN_URL,
		};
	}

	private async _storePaymentRequest(
		courseIds: string[], 
		userId: string
	): Promise<PaymentDocument> {
		const coursesPromise = this._coursesSvc.findAll({
			_id: {
				$in: courseIds
			}
		});
		const userPromise        = this._userSvc.findOneById(userId, [Payment.plural, PurchasedCourse.plural]);
		const [courses, userMDb] = await Promise.all([coursesPromise, userPromise]);
		const amount             = courses.reduce((acc, course) => acc + course.price, 0);
		const payDate            = formatYYYYMMDDHHMMSS(new Date());
		const purchasedCourses   = await this._purchasedCourseSvc.createPurchases(courses);
		const paymentMDb = await this._paymentModel.create({
			amount,
			bankCode: 'unknown',
			date    : payDate,
			content : 'Payment:' + payDate,
			status  : PaymentStatus.Initial,
			user    : userMDb,
			purchasedCourses
		});
		await this._storeUserTransaction(userMDb, paymentMDb, purchasedCourses);
		return paymentMDb;
	}

	private async _updatePaymentStatus(params: VnpIpnParams, status = 'Success') {
		const { vnp_TxnRef:paymentId } = params;
		await this._paymentModel.findByIdAndUpdate(
			paymentId,
			{
				status,
				bankCode: params.vnp_BankCode,
			},
			{ new: true },
		);
	}

	public async findAll(): Promise<PaymentDocument[]> {
		return this._paymentModel.find().populate(User.singular);
	}

	private async _storeUserTransaction(user: UserDocument, payment: PaymentDocument, courses: PurchasedCourse[]) {
		user.payments.push(payment);
		user.purchasedCourses.push(...courses);
		await this._userSvc.update(user._id.toString(), user);
	}
}
