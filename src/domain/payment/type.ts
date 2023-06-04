export type VnpTransactionParams = {
	vnp_Version    : '2.0.1' | '2.1.0',
	vnp_Command    : 'pay',
	vnp_Locale     : 'vn',
	vnp_CurrCode   : 'VND',
	vnp_Amount     : number,
	vnp_TmnCode    : string,
	vnp_CreateDate : string,
	vnp_IpAddr     : string,
	vnp_OrderInfo  : string,
	vnp_ReturnUrl  : string,
	vnp_TxnRef     : string,
};

export type VnpParams = VnpTransactionParams & { vnp_SecureHash: string };

export type VnpIpnParams = VnpParams & {
	vnp_BankCode             : string,
	vnp_TransactionNo        : number,
	vnp_ResponseCode         : string,
	vnp_TransactionStatus    : number,
	vnp_SecureHashType?      : number,
	vnp_PayDate              : string,
}

export type VnpPaymentResponse = {
	vnpResCode: VnpResCode,
	message: string,
}

export enum VnpResCode {
	Success            = '00',
	InvalidOrder       = '01',
	InvalidMerchant    = '02',
	InvalidAmount      = '04',
	ChecksumFailed     = '97',
}

export enum PaymentStatus {
	Initial = 'Initial',
	Success = 'Success',
	FailedForInvalidMerchant   = 'InvalidMerchant',
	FailedForInvalidAmount     = 'InvalidAmount',
	FailedForChecksum          = 'FailedForChecksum'
}

export type CreateTransactionParams = {
	amount: number,
	ipAddress: string,
	date: string,
	orderId: string,
	orderInfo: string,
}
