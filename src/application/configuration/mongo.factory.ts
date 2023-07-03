import { Injectable } from '@nestjs/common';
import {
	MongooseModuleOptions,
	MongooseOptionsFactory,
} from '@nestjs/mongoose';

import { BootConfigService } from './boot.config';



@Injectable()
export class MongoConnectionFactory implements MongooseOptionsFactory {
	private _credentials: string;
	private _uri: string;
	private _dbName: string;

	constructor(private readonly _configSvc: BootConfigService) {
		this._credentials = _configSvc.CERT_PATH;
		this._dbName      = _configSvc.MDB_NAME;
		this._uri         = this._getMongoUri();
	}

	private _getMongoUri() {
		if (this._configSvc.isRunLocal) {
			return this._configSvc.LOCAL_MONGODB_URI;
		}
		return this._configSvc.REMOTE_MONGODB_URI;
	}

	public createMongooseOptions():
	| MongooseModuleOptions
	| Promise<MongooseModuleOptions> {
		const localConfig: MongooseModuleOptions = {
			uri: this._uri,
			dbName: this._dbName,
			ssl: true,
			sslValidate: true,
			sslKey: this._credentials,
			sslCert: this._credentials,
		};
		if (this._configSvc.isRunLocal) {
			return localConfig;
		}
		const remoteConfig: MongooseModuleOptions = {
			uri: this._uri,
			dbName: this._dbName,
		};
		return remoteConfig;
	}
}
