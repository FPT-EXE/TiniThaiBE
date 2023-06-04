import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserDocument } from '../users/entities/user.entity';


@Injectable()
export class AuthService {
	constructor(private readonly _jwtService: JwtService) {}

	public async login(user: UserDocument) {
		const payload = { _id: user._id, email: user.email, role: user.role};
		return {
			access_token: await this._jwtService.signAsync(payload),
		};
	}
}
