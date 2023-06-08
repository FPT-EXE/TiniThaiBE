
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
	public use(req: Request, res: Response, next: NextFunction) {
		const token = req.cookies['access_token'];
		req.headers.authorization = `Bearer ${token}`;
		next();
	}
}
