import { NestFactory } from '@nestjs/core';
import { INestApplication, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';


function enableSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('TiniThai')
		.setDescription('TiniThai API')
		.setVersion('1.0')
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
	app.enableCors();
	await app.listen(app.get(ConfigService).get('PORT'));
}
bootstrap();
