import {
	Controller,
	Post,
	Redirect,
	HttpStatus,
	Body,
	Req,
	Get,
	Query,
	Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { GetUser, Public } from '../auth/decorators';
import { HttpUser } from '../users/entities/user.entity';
import { CoursesService } from '../courses/services/courses.service';
import { UsersService } from '../users/users.service';

import { VnPayService } from './vnpay.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VnpIpnParams } from './types';

import { BootConfigService } from 'src/application/configuration';


@ApiBearerAuth('Bearer')
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
	constructor(
		private readonly _vnPaySvc: VnPayService,
		private readonly _configSvc: BootConfigService,
		private readonly _coursesSvc: CoursesService,
		private readonly _userSvc: UsersService,
	) {}

	// @Redirect()
	@Post('url')
	public async createPaymentUrl(
		@Req() req: Request,
			@Body() { courseIds }: CreatePaymentDto,
			@GetUser() {_id: userId}: HttpUser,
	): Promise<RedirectAction> {
		const ipAddress = req.socket.remoteAddress.replace(/^.*:/, '');
		// const promises = courseIds.map(id => this._coursesSvc.findOneById(id));
		// const courses = await Promise.all(promises);
		// await this._vnPaySvc.addCoursesForUser(userId, courses);
		// const amount = courses.reduce((acc, course) => acc + course.price, 0);
		const paymentUrl = await this._vnPaySvc.createPaymentUrl({
			// amount,
			courseIds,
			ipAddress,
			userId
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
	public async vnpIpn(@Query() query: VnpIpnParams, @Res() response: Response) {
		try {
			await this._vnPaySvc.vnpIpn(query);
			response.redirect(`${this._configSvc.FRONTEND_DOMAIN}/payment?isSuccess=true`);
		} catch {
			response.redirect(`${this._configSvc.FRONTEND_DOMAIN}/payment?isSuccess=false`);
		}
		return;
	}

	@Get()
	public async findAll() {
		return this._vnPaySvc.findAll();
	}
}
