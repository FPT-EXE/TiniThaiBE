import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
	public create(createUserDto: CreateUserDto) {
		return 'This action adds a new user';
	}

	public findAll() {
		return 'This action returns all users';
	}

	public findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	public update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	public remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
