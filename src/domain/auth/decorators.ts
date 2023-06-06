import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

import { HttpUser } from '../users/entities/user.entity';


export const GetUser = createParamDecorator(
	(_data, ctx: ExecutionContext): HttpUser => {
		const req = ctx.switchToHttp().getRequest();
		return req['user'] as HttpUser;
	},
);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
