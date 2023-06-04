import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';


enum Environment {
	Local = 'local',
	Dev   = 'dev',
	Prod  = 'prod',
	Sit   = 'sit',
}

class EnvironmentVariables {
	@IsEnum(Environment)
	public NODE_ENV: Environment;

	@IsNumber()
	public PORT: number;

	@IsNotEmpty()
	public MONGODB_URI: string;

	@IsNotEmpty()
	public CERT_PATH: string;
}

export function validateEnv(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
