import crypto from 'crypto';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import qs from 'qs';

import { BootConfigService } from '../../application/configuration/boot.config';
import { formatYYYYMMDDHHMMSS, sortObject } from '../../application/utils';

import { TransactionParams, VnPayIpnParams, VnPayParams } from './type';


type CreatePaymentParam = {
	amount: number,
	ipAddress: string,
};

@Injectable()
export class VnPayService {
	constructor(private readonly _configSvc: BootConfigService) {}

	public createPaymentUrl({ amount, ipAddress }: CreatePaymentParam): string {
		const vnpUrl = this._configSvc.VNP_URL;
		const secretKey = this._configSvc.VNP_HASHSECRET;
		const transactionParams = sortObject(
			this._createTransactionParams(amount, ipAddress),
		);

		const vnpParams: VnPayParams = {
			vnp_SecureHash: this._signHashKey(transactionParams, secretKey),
			...transactionParams,
		};

		const paymentUrl = vnpUrl + '?' + qs.stringify(vnpParams, { encode: false });
		return paymentUrl;
	}

	public vnpReturn(vnpParams: VnPayIpnParams) {
		const secureHash = vnpParams.vnp_SecureHash;
		delete vnpParams.vnp_SecureHash;
		delete vnpParams.vnp_SecureHashType;
		vnpParams = sortObject(vnpParams);

		const secretKey = this._configSvc.VNP_HASHSECRET;
		const signData = qs.stringify(vnpParams, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

		if (secureHash !== signed)
			throw new InternalServerErrorException('Payment failure');
		return { code: vnpParams.vnp_ResponseCode };
	}

	private _signHashKey(
		transactionParams: TransactionParams,
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
	): TransactionParams {
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
}
