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

	public createPaymentUrl({ amount, ipAddress }: CreatePaymentParam): string {
		const vnpUrl = this._configSvc.VNP_URL;
		const secretKey = this._configSvc.VNP_HASHSECRET;
		const transactionParams = sortObject(
			this._createTransactionParams(amount, ipAddress),
		);

		const vnpParams: VnpParams = {
			vnp_SecureHash: this._signHashKey(transactionParams, secretKey),
			...transactionParams,
		};

		const paymentUrl = vnpUrl + '?' + qs.stringify(vnpParams, { encode: false });
		return paymentUrl;
	}

	public vnpReturn(inpParams: VnpIpnParams): VnpPaymentResponse {
		const isValid = this._validateCheckSum(inpParams);
		if (!isValid) {
			throw new InternalServerErrorException('Checksum failed');
		}
		return { vnpResCode: VnpResCode.Success, message: 'Payment success' };
	}

	public async vnpIpn(inpParams: VnpIpnParams) {
		const isValid = this._validateCheckSum(inpParams);
		const { vnp_ResponseCode: vnpResCode } = inpParams;
		if (!isValid) {
			return await this._storePayment(inpParams, 'Fail for checksum');
		}
		switch (vnpResCode) {
			case VnpResCode.Success:
				return await this._storePayment(inpParams);
			case VnpResCode.InvalidMerchant:
				return await this._storePayment(inpParams, 'InvalidMerchant');
			case VnpResCode.InvalidAmount:
				return await this._storePayment(inpParams,'InvalidAmount');
			case VnpResCode.InvalidOrder:
				return await this._storePayment(inpParams, 'InvalidOrder');
		}
	}

	private _validateCheckSum(inpParams: VnpIpnParams): boolean {
		let isValid = true;
		const secureHash = inpParams.vnp_SecureHash;
		delete inpParams.vnp_SecureHash;
		delete inpParams.vnp_SecureHashType;
		inpParams = sortObject(inpParams);

		const secretKey = this._configSvc.VNP_HASHSECRET;
		const signData = qs.stringify(inpParams, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

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
		amount: number,
		ipAddress: string,
	): VnpTransactionParams {
		const createDate = formatYYYYMMDDHHMMSS(new Date());
		const orderId = createDate.slice(-6); //HHmmss
		return {
			vnp_Version: '2.1.0',
			vnp_Command: 'pay',
			vnp_Locale: 'vn',
			vnp_CurrCode: 'VND',
			vnp_IpAddr: ipAddress,
			vnp_TxnRef: orderId,
			vnp_OrderInfo: 'Payment:' + orderId,
			vnp_Amount: amount * 100,
			vnp_CreateDate: createDate,
			vnp_TmnCode: this._configSvc.VNP_TMNCODE,
			vnp_ReturnUrl: this._configSvc.VNP_RETURN_URL,
		};
	}

	private async _storePayment(params: VnpIpnParams, status = 'Success') {
		const {
			vnp_Amount: amount,
			vnp_BankCode: bankCode,
			vnp_PayDate: date,
			vnp_OrderInfo: content,
		} = params;

		// for testing
		const user = await this._userModel.findOne({
			name: 'test'
		});

		this._paymentModel.create({
			amount,
			bankCode,
			content,
			date,
			user,
			status
		});
	}

	public async findAll(): Promise<PaymentDocument[]> {
		return this._paymentModel.find().populate(User.singular);
	}
}
