import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

import { AppConfigModule } from 'src/application/configuration/config.module';


@Module({
	imports: [AppConfigModule],
	controllers: [AuthController],
	providers: [AuthService, FirebaseAuthStrategy]
})
export class AuthModule {}
