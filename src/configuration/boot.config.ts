import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


export enum ConfigEnv  {
	PORT='PORT',
	NODE_ENV='NODE_ENV',
	DATABASE_USER='DATABASE_USER',
	DATABASE_PASSWORD='DATABASE_PASSWORD',
}

@Injectable()
export class BootConfigService {
	constructor(private _configService: ConfigService) {}

	public get port(): number {
		return Number(this._configService.get(ConfigEnv.PORT) || 3000);
	}

	public get environment(): string {
		return this._configService.get(ConfigEnv.NODE_ENV);
	}

	public get dbUsername(): string {
		return this._configService.get(ConfigEnv.DATABASE_USER);
	}

	public get dbPassword(): string {
		return this._configService.get(ConfigEnv.DATABASE_PASSWORD);
	}
}
