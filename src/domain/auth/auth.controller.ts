import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseUser } from './types';


@ApiTags('auth')
@Controller('auth')
export class AuthController {

	constructor(private readonly _usersSvc: UsersService){}

	@UseGuards(FirebaseAuthGuard)
	@Post('login')
	public async login(@Req() {user: {email}}: Request & {user: FirebaseUser}) {
		let user = await this._usersSvc.findOne({email});
		if (user === null) {
			const newUser = new User();
			newUser.email = email;
			user = await this._usersSvc.create(newUser);
		}
		return user;
	}
}
