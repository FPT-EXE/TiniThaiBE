import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AppConfigModule , BootConfigService } from '../../application/configuration';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';
import { JwtFactory } from './jwt.factory';



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
	providers: [AuthService, FirebaseAuthStrategy],
})
export class AuthModule {}
