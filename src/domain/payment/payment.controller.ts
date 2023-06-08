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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { GetUser, Public } from '../auth/decorators';
import { User } from '../users/entities/user.entity';
import { CoursesService } from '../courses/services/courses.service';

import { VnPayService } from './vnpay.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VnpIpnParams } from './types';


@ApiBearerAuth('Bearer')
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
	constructor(
		private readonly _vnPaySvc: VnPayService,
		private readonly _coursesSvc: CoursesService,
	) {}

	// @Redirect()
	@Post('url')
	public async createPaymentUrl(
		@Req() req: Request,
			@Body() { courseIds }: CreatePaymentDto,
			@GetUser() user: User,
	): Promise<RedirectAction> {
		const ipAddress = req.socket.remoteAddress.replace(/^.*:/, '');
		const promises = courseIds.map(id => this._coursesSvc.findOneById(id));
		const courses = await Promise.all(promises);
		const  amount = courses.reduce((acc, course) => acc + course.price, 0);
		const paymentUrl = await this._vnPaySvc.createPaymentUrl({
			amount,
			ipAddress,
			user
		});
		return {
			url: paymentUrl,
			status: HttpStatus.FOUND,
		};
	}

	@Get('payment-result')
	public vnpReturn(@Query() query: VnpIpnParams) {
		return this._vnPaySvc.vnpReturn(query);
	}

	@Public()
	@Get('vnpay-ipn')
	public async vnpIpn(@Query() query: VnpIpnParams) {
		return await this._vnPaySvc.vnpIpn(query);
	}

	@Get()
	public async findAll() {
		return this._vnPaySvc.findAll();
	}
}
