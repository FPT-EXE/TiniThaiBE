import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';


@Module({
	imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
	controllers: [UsersController],
	providers: [UsersService]
})
export class UsersModule {}
