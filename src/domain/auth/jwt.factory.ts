import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { BootConfigService } from 'src/application/configuration/boot.config';



@Injectable()
export class JwtFactory implements JwtOptionsFactory {

	constructor(private readonly _configSvc: BootConfigService) {
	}
	public createJwtOptions(): JwtModuleOptions {
		return {
			global: true,
			signOptions: { expiresIn: this._configSvc.JWT_EXPIRES_IN },
			secret: this._configSvc.JWT_SECRET
		};
	}


}
