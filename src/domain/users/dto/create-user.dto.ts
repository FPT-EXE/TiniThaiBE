import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from '../entities/user.entity';


export class CreateUserDto {
	@IsNotEmpty()
	@ApiProperty()
	public name: string;

	@IsNotEmpty()
	@ApiProperty()
	@IsEmail()
	public email: string;

	@IsEnum(Role)
	@ApiProperty()
	public role: Role;
}
