import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppService } from './app.service';




@ApiBearerAuth('Bearer')
@Controller()
export class AppController {
	constructor(private readonly _appService: AppService) {}

	@Get()
	public getHello(): string {
		return this._appService.getHello();
	}
}
