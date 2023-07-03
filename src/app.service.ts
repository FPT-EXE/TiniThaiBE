import { Injectable } from '@nestjs/common';

import { BootConfigService } from './application/configuration';


@Injectable()
export class AppService {

	constructor(private readonly _configSvc: BootConfigService) {
		
	}

	public getVersion() {
		return {
			sha: this._configSvc.GIT_SHA
		};
	}
}
