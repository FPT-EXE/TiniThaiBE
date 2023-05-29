import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';


enum Environment {
	Dev = 'dev',
	Prod = 'prod',
	Sit = 'sit',
}

class EnvironmentVariables {
	@IsEnum(Environment)
	public NODE_ENV: Environment;

	@IsNumber()
	public PORT: number;
	
	@IsNotEmpty()
	public DATABASE_USER: string;
    
	@IsNumber()
	public DATABASE_PASSWORD: string;
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
