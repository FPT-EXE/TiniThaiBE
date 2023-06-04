export type TransactionParams = {
	vnp_Version: '2.0.1' | '2.1.0',
	vnp_Command: 'pay',
	vnp_Locale: 'vn',
	vnp_CurrCode: 'VND',
	vnp_Amount: number,
	vnp_TmnCode: string,
	vnp_CreateDate: string,
	vnp_IpAddr: string,
	vnp_OrderInfo: string,
	vnp_ReturnUrl: string,
	vnp_TxnRef: string,
};

export type VnPayParams = TransactionParams & { vnp_SecureHash: string };

export type VnPayIpnParams = VnPayParams & {
	vnp_BankCode: string,
	vnp_TransactionNo: number,
	vnp_ResponseCode: string,
	vnp_TransactionStatus: number,
	vnp_SecureHashType?: number,
}
