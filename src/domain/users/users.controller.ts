import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Param,
	Delete,
	HttpCode,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CoursesService } from '../courses/courses.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterCourseDto } from './dto/register-course.dto';


@ApiTags('users')
@UseGuards(FirebaseAuthGuard)
@Controller('users')
export class UsersController {
	constructor(
		private readonly _usersSvc: UsersService,
		private readonly _courseSvc: CoursesService,
	) {}

	@Post()
	public async create(@Body() createUserDto: CreateUserDto) {
		return this._usersSvc.create(createUserDto);
	}

	@Get()
	public async findAll() {
		return this._usersSvc.findAll();
	}

	@Get(':id')
	public async findOne(@Param('id') id: string) {
		return this._usersSvc.findOne(id);
	}

	@Put(':id')
	public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this._usersSvc.update(id, updateUserDto);
	}

	@Put(':id/courses')
	public async registerCourse(
	@Param('id') id: string,
		@Body() { courseId }: RegisterCourseDto,
	) {
		const user = await this._usersSvc.findOne(id);
		const course = await this._courseSvc.findOne(courseId);
		user.courses.push(course);
		return this._usersSvc.update(id, user);
	}

	@Delete(':id')
	public async remove(@Param('id') id: string) {
		return this._usersSvc.remove(id);
	}
}
