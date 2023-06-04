import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

import { User } from '../users/entities/user.entity';


export const GetUser = createParamDecorator(
	(_data, ctx: ExecutionContext): User => {
		const req = ctx.switchToHttp().getRequest();
		return req['user'] as User;
	},
);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
