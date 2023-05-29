import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { ExercisesModule } from './exercises/exercises.module';
import { validateEnv } from './configuration/env.validation';
import { BootConfigService } from './configuration/boot.config';
import { MongoConnectionFactory } from './configuration/mongo.factory';
import { LessonsModule } from './lessons/lessons.module';


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
	providers: [AppService, BootConfigService, MongoConnectionFactory],
	exports: [BootConfigService]
})
export class AppModule {}
