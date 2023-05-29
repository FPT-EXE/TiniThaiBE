import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


export enum ConfigEnv {
	PORT = 'PORT',
	NODE_ENV = 'NODE_ENV',
	DATABASE_USER = 'DATABASE_USER',
	DATABASE_PASSWORD = 'DATABASE_PASSWORD',
	MONGODB_URI = 'MONGODB_URI',
	CERT_PATH = 'CERT_PATH'
}

@Injectable()
export class BootConfigService {
	constructor(private _configService: ConfigService) {}

	public get PORT(): number {
		return Number(this._configService.get(ConfigEnv.PORT) || 3000);
	}

	public get NODE_ENV(): string {
		return this._configService.get(ConfigEnv.NODE_ENV);
	}

	public get DATABASE_USER(): string {
		return this._configService.get(ConfigEnv.DATABASE_USER);
	}

	public get DATABASE_PASSWORD(): string {
		return this._configService.get(ConfigEnv.DATABASE_PASSWORD);
	}

	public get MONGODB_URI(): string {
		return this._configService.get(ConfigEnv.MONGODB_URI);
	}

	public get CERT_PATH(): string {
		return this._configService.get(ConfigEnv.CERT_PATH);
	}
}
