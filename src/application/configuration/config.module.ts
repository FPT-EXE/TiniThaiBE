import { Module } from '@nestjs/common';


import { BootConfigService } from './boot.config';



@Module({
	providers: [BootConfigService],
	exports: [BootConfigService]
})
export class AppConfigModule {}
