import {
	Controller,
	Post,
	Redirect,
	HttpStatus,
	Body,
	Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { VnPayService } from './vnpay.service';
import { CreatePaymentDto } from './dto/create-payment.dto';


@ApiTags('payment')
@Controller('payment')
export class PaymentController {
	constructor(private readonly _vnPaySvc: VnPayService) {}

	@Redirect()
	@Post()
	public createPaymentUrl(
		@Req() req: Request,
			@Body() { amount }: CreatePaymentDto,
	): RedirectAction {
		const ipAddress = req.socket.remoteAddress;
		const paymentUrl = this._vnPaySvc.createPaymentUrl({ amount, ipAddress });
		return {
			url: paymentUrl,
			status: HttpStatus.FOUND,
		};
	}
}
