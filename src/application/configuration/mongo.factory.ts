import { Injectable } from '@nestjs/common';
import {
	MongooseModuleOptions,
	MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { BootConfigService } from './boot.config';



@Injectable()
export class MongoConnectionFactory implements MongooseOptionsFactory {
	private _credentials: string;

	constructor(private readonly _configSvc: BootConfigService) {
		this._credentials = _configSvc.CERT_PATH;
	}

	public createMongooseOptions():
	| MongooseModuleOptions
	| Promise<MongooseModuleOptions> {
		return {
			uri: this._configSvc.MONGODB_URI,
			ssl: true,
			sslValidate: true,
			sslKey: this._credentials,
			sslCert: this._credentials,
			dbName: 'tinithai'
		};
	}
}
