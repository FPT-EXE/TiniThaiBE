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
import { VnPayIpnParams } from './type';


@ApiTags('payment')
@Controller('payment')
export class PaymentController {
	constructor(private readonly _vnPaySvc: VnPayService) {}

	// @Redirect()
	@Post()
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
	public vnpReturn(@Query() query: VnPayIpnParams) {
		return this._vnPaySvc.vnpReturn(query);
	}
}
