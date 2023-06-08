import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from '../users/users.module';
import {
	AppConfigModule,
	BootConfigService,
} from '../../application/configuration';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { JwtFactory } from './jwt.factory';
import { JwtAuthGuard } from './jwt-auth.guard';


@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [AppConfigModule],
			inject: [BootConfigService],
			useClass: JwtFactory,
		}),
		AppConfigModule,
		UsersModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		FirebaseAuthStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AuthModule {}
