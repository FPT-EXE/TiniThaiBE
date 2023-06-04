import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from './decorators';

import { BootConfigService } from 'src/application/configuration';


@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly _jwtService: JwtService,
		private readonly _configSvc: BootConfigService,
		private readonly _reflector: Reflector,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = this._extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this._jwtService.verifyAsync(token, {
				secret: this._configSvc.JWT_SECRET,
			});
			request['user'] = payload;
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}

	private _extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
