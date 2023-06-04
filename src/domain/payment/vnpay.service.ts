import crypto from 'crypto';

import qs from 'qs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BootConfigService } from '../../application/configuration/boot.config';
import { formatYYYYMMDDHHMMSS, sortObject } from '../../application/utils';
import { User } from '../users/entities/user.entity';

import {
	VnpTransactionParams,
	VnpIpnParams,
	VnpParams,
	VnpPaymentResponse,
	VnpResCode,
	PaymentStatus,
	CreateTransactionParams,
} from './type';
import { Payment, PaymentDocument } from './entities/payment.entity';


type CreatePaymentParam = {
	amount: number,
	ipAddress: string,
};

@Injectable()
export class VnPayService {
	constructor(
		private readonly _configSvc: BootConfigService,
		@InjectModel(Payment.name) private readonly _paymentModel: Model<Payment>,
		@InjectModel(User.name) private readonly _userModel: Model<User>,
	) {}

	public async createPaymentUrl({
		amount,
		ipAddress,
	}: CreatePaymentParam): Promise<string> {
		const {
			date,
			_id: orderId,
			content: orderInfo,
		} = await this._storePaymentRequest(amount);
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

	private async _storePaymentRequest(amount: number): Promise<PaymentDocument> {
		const payment = new Payment();
		payment.amount   = amount;
		payment.bankCode = 'unknown';
		payment.date     = formatYYYYMMDDHHMMSS(new Date());
		payment.content  = 'Payment:' + payment.date,
		payment.status   = PaymentStatus.Initial;
		const user = await this._userModel
			.findOne({
				name: 'test',
			})
			.populate(Payment.plural);
		payment.user = user;
		const paymentDb = await this._paymentModel.create(payment);
		user.payments.push(paymentDb);
		await this._userModel.updateOne(null, user);
		return paymentDb;
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
}
