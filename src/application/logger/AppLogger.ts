import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
	private _logger = new Logger('HTTP');

	public use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, originalUrl: url } = request;
		const userAgent = request.get('user-agent') || '';

		response.on('finish', () => {
			const { statusCode } = response;
			const contentLength = response.get('content-length');

			this._logger.log(
				`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
			);
		});

		next();
	}
}
