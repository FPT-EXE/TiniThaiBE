import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HttpUser, UserDocument } from '../users/entities/user.entity';


@Injectable()
export class AuthService {
	constructor(private readonly _jwtService: JwtService) {}

	public async login(user: UserDocument) {
		const payload: HttpUser = {
			_id: user._id.toString(),
			email: user.email,
			role: user.role,
		};
		return {
			access_token: await this._jwtService.signAsync(payload),
		};
	}
}
