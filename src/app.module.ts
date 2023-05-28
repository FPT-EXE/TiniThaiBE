import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { ExercisesModule } from './exercises/exercises.module';


@Module({
	imports: [ConfigModule.forRoot({
		cache: true,
		isGlobal: true
	}),CoursesModule, UsersModule, ExercisesModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
