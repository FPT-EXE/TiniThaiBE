import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoursesModule } from '../courses/courses.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';


@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		CoursesModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [MongooseModule, UsersService],
})
export class UsersModule {}
