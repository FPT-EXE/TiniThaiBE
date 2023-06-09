import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './domain/courses/courses.module';
import { UsersModule } from './domain/users/users.module';
import { validateEnv } from './application/configuration/env.validation';
import { MongoConnectionFactory } from './application/configuration/mongo.factory';
import { AllExceptionsFilter } from './application/filter/AllExceptionsFilter';
import { PaymentModule } from './domain/payment/payment.module';
import { AppConfigModule, BootConfigService } from './application/configuration';
import { AppLoggerMiddleware } from './application/logger/AppLogger';
import { AuthModule } from './domain/auth/auth.module';
import { FilesModule } from './domain/files/files.module';
import { AuthMiddleware } from './domain/auth/auth.middleware';


@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			validate: validateEnv,
			expandVariables: true,
		}),
		AppConfigModule,
		MongooseModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [BootConfigService],
			useClass: MongoConnectionFactory
		}),
		CoursesModule,
		UsersModule,
		PaymentModule,
		AuthModule,
		FilesModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		MongoConnectionFactory,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe
		},
	],
})
export class AppModule implements NestModule  {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
