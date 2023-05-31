import crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import qs from 'qs';

import { BootConfigService } from '../../application/configuration/boot.config';
import {
	formatHHMMSS,
	formatYYYYMMDDHHMMSS,
	sortObject,
} from '../../application/utils';


type TransactionParams = {
	vnp_Version    : '2.0.1' | '2.1.0',
	vnp_Command    : 'pay',
	vnp_Locale     : 'vn',
	vnp_CurrCode   : 'VND',
	vnp_TmnCode    : string,
	vnp_Amount     : string,
	vnp_CreateDate : string,
	vnp_IpAddr     : string,
	vnp_OrderInfo  : string,
	vnp_ReturnUrl  : string,
	vnp_TxnRef     : string,
};

type VnPayParams = TransactionParams & { vnp_SecureHash: string };

type CreatePaymentParam = {
	amount: number,
	ipAddress: string,
};

@Injectable()
export class VnPayService {
	constructor(private readonly _configSvc: BootConfigService) {}

	public createPaymentUrl({ amount, ipAddress }: CreatePaymentParam): string {
		const vnpUrl              = this._configSvc.VNP_URL;
		const secretKey           = this._configSvc.VNP_HASHSECRET;
		const transactionParams   = sortObject(this._createTransactionParams(amount, ipAddress));
		
		const vnpParams: VnPayParams = {
			vnp_SecureHash: this._signHashKey(transactionParams, secretKey),
			...transactionParams,
		};

		const paymentUrl = vnpUrl + '?' + qs.stringify(vnpParams, { encode: false });
		return paymentUrl;
	}

	private _signHashKey(transactionParams: TransactionParams,secretKey: string): string {
		const signData    = qs.stringify(transactionParams, { encode: false });
		const hmac        = crypto.createHmac('sha512', secretKey);
		const signed      = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
		return signed;
	}

	private _createTransactionParams(amount: number, ipAddress: string): TransactionParams {
		const current = new Date();
		const orderId = formatHHMMSS(current);
		return {
			vnp_Version    : '2.1.0',
			vnp_Command    : 'pay',
			vnp_Locale     : 'vn',
			vnp_CurrCode   : 'VND',
			vnp_IpAddr     : ipAddress,
			vnp_TxnRef     : orderId,
			vnp_OrderInfo  : 'Payment:' + orderId,
			vnp_Amount     : String(amount * 100),
			vnp_CreateDate : formatYYYYMMDDHHMMSS(current),
			vnp_TmnCode    : this._configSvc.VNP_TMNCODE,
			vnp_ReturnUrl  : this._configSvc.VNP_RETURN_URL,
		};
	}
}
