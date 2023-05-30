import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../entities/user.entity';


export class CreateUserDto {
	@ApiProperty()
	public name: string;

	@ApiProperty()
	public email: string;

	@ApiProperty()
	public password: string;

	@ApiProperty()
	public reenterPassword: string;

	@ApiProperty()
	public role: Role;
}
