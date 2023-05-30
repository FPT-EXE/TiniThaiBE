import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './domain/courses/courses.module';
import { UsersModule } from './domain/users/users.module';
import { ExercisesModule } from './domain/exercises/exercises.module';
import { LessonsModule } from './domain/lessons/lessons.module';
import { validateEnv } from './application/configuration/env.validation';
import { BootConfigService } from './application/configuration/boot.config';
import { MongoConnectionFactory } from './application/configuration/mongo.factory';
import { AllExceptionsFilter } from './application/filter/AllExceptionsFilter';


@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			validate: validateEnv,
			expandVariables: true,
		}),
		MongooseModule.forRootAsync({
			imports: [AppModule],
			inject: [BootConfigService],
			useClass: MongoConnectionFactory
		}),
		CoursesModule,
		UsersModule,
		ExercisesModule,
		LessonsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		BootConfigService,
		MongoConnectionFactory,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe
		}

	],
	exports: [BootConfigService],
})
export class AppModule {}
