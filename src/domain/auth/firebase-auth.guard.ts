import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';


@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-auth') {
	constructor(private readonly _reflector: Reflector) {
		super();
	}
	public canActivate(context: ExecutionContext) {
		const isPublic = this._reflector.getAllAndOverride<boolean>('public', [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}
		return super.canActivate(context);
	}
}
