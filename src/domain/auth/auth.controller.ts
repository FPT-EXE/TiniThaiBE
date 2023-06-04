import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseUser } from './types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser, Public } from './decorators';


@ApiBearerAuth('Bearer')
@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly _usersSvc: UsersService,
		private readonly _authSvc: AuthService,
	) {}

	@Public()
	@UseGuards(FirebaseAuthGuard)
	@Post('login')
	public async login(@Req() { user: { email } }: Request & { user: FirebaseUser }) {
		let user = await this._usersSvc.findOne({ email });
		if (user === null) {
			const newUser = new User();
			newUser.email = email;
			user = await this._usersSvc.create(newUser);
		}
		return await this._authSvc.login(user);
	}

	@Public()
	@Post('gen-token')
	public async noop(@Body() { email  }: LoginDto) {
		return await this.login({user: {email}} as any);
	}


	@Get('profile')
	public async getProfile(@GetUser() user: User) {
		return user;
	}
}
