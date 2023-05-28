import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';


@Controller()
export class AppController {
	constructor(private readonly _appService: AppService) {}

	@Get()
	public getHello(): string {
		return this._appService.getHello();
	}
}
