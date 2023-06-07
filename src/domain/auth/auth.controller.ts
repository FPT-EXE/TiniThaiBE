import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { HttpUser, User } from '../users/entities/user.entity';

import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseUser } from './types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser, Public } from './decorators';

import { BootConfigService } from 'src/application/configuration';


@ApiBearerAuth('Bearer')
@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly _usersSvc: UsersService,
		private readonly _authSvc: AuthService,
		private readonly _configSvc: BootConfigService,
	) {}

	@Public()
	@UseGuards(FirebaseAuthGuard)
	@Post('login')
	public async login(
	@Req() { user: { email } }: Request & { user: FirebaseUser },
		@Res({ passthrough: true }) response: Response,
	) {
		let user = await this._usersSvc.findOne({ email });
		if (user === null) {
			const newUser = new User();
			newUser.email = email;
			user = await this._usersSvc.create(newUser);
		}
		const token = await this._authSvc.login(user);
		response.cookie('access_token', token.access_token, {
			httpOnly: true,
			domain: this._configSvc.NODE_ENV !== 'local' ? this._configSvc.FRONTEND_DOMAIN : undefined,
		});
		return token;
	}

	@Public()
	@Post('gen-token')
	public async noop(
	@Body() { email }: LoginDto,
		@Res({ passthrough: true }) response: Response,
	) {
		return await this.login({ user: { email } } as any, response);
	}

	@Get('profile')
	public async getProfile(@GetUser() httpUser: HttpUser) {
		const user = await this._usersSvc.findOneById(httpUser._id);
		return user;
	}
}
