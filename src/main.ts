import { NestFactory } from '@nestjs/core';
import { INestApplication, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';


function enableSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('TiniThai')
		.setDescription('TiniThai API')
		.setVersion('1.0')
		.addSecurity('Bearer', {
			type: 'http',
			scheme: 'Bearer',
		})
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/v1/tinithai/api', app, document); // replace with process.env.API_PREFIX
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('/v1/tinithai', {
		exclude: [{ path: 'health', method: RequestMethod.GET }],
	});
	enableSwagger(app);
	const configSvc = app.get(ConfigService);
	app.enableCors({
		origin: '*',
		credentials: true
	});
	app.use(cookieParser(configSvc.get('COOKIE_SECRET')));
	await app.listen(configSvc.get('PORT'));
}
bootstrap();
