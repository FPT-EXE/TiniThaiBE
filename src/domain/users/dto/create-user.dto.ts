import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { Role } from '../entities/user.entity';


export class CreateUserDto {
	@ApiProperty()
	@IsOptional()
	public name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	public email: string;

	@ApiProperty()
	@IsEnum(Role)
	@IsOptional()
	public role: Role;
}
