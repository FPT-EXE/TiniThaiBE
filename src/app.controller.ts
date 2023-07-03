import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Public } from './domain/auth/decorators';




@ApiBearerAuth('Bearer')
@Controller()
export class AppController {
	constructor(private readonly _appService: AppService) {}

	@Public()
	@Get('health')
	public getHello() {
		return this._appService.getVersion();
	}
}
