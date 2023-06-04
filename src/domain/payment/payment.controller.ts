import {
	Controller,
	Post,
	Redirect,
	HttpStatus,
	Body,
	Req,
	Get,
	Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { VnPayService } from './vnpay.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VnpIpnParams } from './type';


@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
	constructor(private readonly _vnPaySvc: VnPayService) {}

	// @Redirect()
	@Post('url')
	public createPaymentUrl(
		@Req() req: Request, @Body() { amount }: CreatePaymentDto,
	): RedirectAction {
		const ipAddress = req.socket.remoteAddress.replace(/^.*:/, '');
		const paymentUrl = this._vnPaySvc.createPaymentUrl({ amount, ipAddress });
		return {
			url: paymentUrl,
			status: HttpStatus.FOUND,
		};
	}

	@Get('payment-result')
	public vnpReturn(@Query() query: VnpIpnParams) {
		return this._vnPaySvc.vnpReturn(query);
	}

	@Get('vnpay-ipn')
	public async vnpIpn(@Query() query: VnpIpnParams) {
		return await this._vnPaySvc.vnpIpn(query);
	}

	@Get()
	public async findAll() {
		return this._vnPaySvc.findAll();
	}
}
