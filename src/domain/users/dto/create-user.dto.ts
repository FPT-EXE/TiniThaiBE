import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from '../entities/user.entity';


export class CreateUserDto {
	@IsNotEmpty()
	@ApiProperty()
	public name: string;

	@IsNotEmpty()
	@ApiProperty()
	public email: string;

	@IsNotEmpty()
	@ApiProperty()
	public password: string;

	@IsNotEmpty()
	@ApiProperty()
	public reenterPassword: string;

	@IsEnum(Role)
	@ApiProperty()
	public role: Role;
}
