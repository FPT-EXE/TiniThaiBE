import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly _usersService: UsersService) {}

	@Post()
	public create(@Body() createUserDto: CreateUserDto) {
		return this._usersService.create(createUserDto);
	}

	@Get()
	public findAll() {
		return this._usersService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string) {
		return this._usersService.findOne(+id);
	}

	@Patch(':id')
	public update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this._usersService.update(+id, updateUserDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string) {
		return this._usersService.remove(+id);
	}
}
