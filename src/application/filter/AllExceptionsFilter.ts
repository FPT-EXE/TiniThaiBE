import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}
	private _logger = new Logger('Exception');

	public catch(exception: unknown, host: ArgumentsHost): void {
		this._logger.error(exception  as any);
		const { httpAdapter } = this._httpAdapterHost;
		const ctx = host.switchToHttp();
		let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		let responseBody: unknown = {
			statusCode: httpStatus,
			message: 'Internal Server Error',
			error: 'SERVER_ERROR'
		};
		if (exception instanceof HttpException) {
			httpStatus = exception.getStatus();
			responseBody = exception.getResponse();
		}
		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
