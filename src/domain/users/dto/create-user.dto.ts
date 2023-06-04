import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from '../entities/user.entity';


export class CreateUserDto {
	@ApiProperty()
	public name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	public email: string;

	@ApiProperty()
	public role: Role;
}
