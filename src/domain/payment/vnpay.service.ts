import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import * as qs from 'qs';

import { BootConfigService } from '../../application/configuration/boot.config';
import {
	formatHHMMSS,
	formatYYYYMMDDHHMMSS,
	sortObject,
} from '../../application/utils';


type VnPayParams = {
	vnp_Version: string,
	vnp_Command: string,
	vnp_TmnCode: string,
	vnp_Amount: string,
	vnp_CreateDate: string,
	vnp_CurrCode: string,
	vnp_IpAddr: string,
	vnp_Locale: string,
	vnp_OrderInfo: string,
	vnp_ReturnUrl: string,
	vnp_TxnRef: string,
};

type VnPayParamsHash = VnPayParams & { vnp_SecureHash: string };

type Payment = {
	amount: number,
	ipAddress: string,
};

@Injectable()
export class VnPayService {
	constructor(private readonly _configSvc: BootConfigService) {}

	public createPaymentUrl({ amount, ipAddress }: Payment): string {
		const vnpUrl = this._configSvc.VNP_URL;
		const returnUrl = this._configSvc.VNP_RETURN_URL;
		const tmnCode = this._configSvc.VNP_TMNCODE;
		const secretKey = this._configSvc.VNP_HASHSECRET;
		const locale = 'vn';
		const current = new Date();
		const vnpCreateDate = formatYYYYMMDDHHMMSS(current);
		const orderId = formatHHMMSS(current);
		const orderInfo = 'Payment:' + orderId;
		const vnpVersion = '2.1.0';
		const vnpCommand = 'pay';
		const vnpAmount = `${amount * 100}`;
		const currCode = 'VND';

		let vnpParams: VnPayParams = {
			vnp_Version: vnpVersion,
			vnp_Command: vnpCommand,
			vnp_TmnCode: tmnCode,
			vnp_Amount: vnpAmount,
			vnp_CreateDate: vnpCreateDate,
			vnp_CurrCode: currCode,
			vnp_IpAddr: ipAddress,
			vnp_Locale: locale,
			vnp_OrderInfo: orderInfo,
			vnp_ReturnUrl: returnUrl,
			vnp_TxnRef: orderId,
		};
		vnpParams = sortObject(vnpParams);

		const signData = qs.stringify(vnpParams, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
		const hashingVnpParams: VnPayParamsHash = {
			vnp_SecureHash: signed,
			...vnpParams,
		};

		const paymentUrl = vnpUrl + '?' + qs.stringify(hashingVnpParams, { encode: false });
		return paymentUrl;
	}
}
