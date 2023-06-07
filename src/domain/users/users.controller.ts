import fs from 'fs';

import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Param,
	Delete,
	UploadedFile,
	UseInterceptors,
	Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CoursesService } from '../courses/services/courses.service';
import { GetUser } from '../auth/decorators';
import { FilesService } from '../files/files.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

import { AvatarUploadDto } from './dto/avatar.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterCourseDto } from './dto/register-course.dto';
import { HttpUser } from './entities/user.entity';


@ApiBearerAuth('Bearer')
@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly _usersSvc: UsersService,
		private readonly _courseSvc: CoursesService,
		private readonly _filesSvc: FilesService,
		private readonly _cloudinarySvc: CloudinaryService,
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
		return this._usersSvc.findOneById(id);
	}

	@Put(':id')
	public async update(
	@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this._usersSvc.update(id, updateUserDto);
	}

	@Put(':id/courses')
	public async registerCourse(
	@Param('id') id: string,
		@Body() { courseId }: RegisterCourseDto,
	) {
		const user = await this._usersSvc.findOneById(id);
		const course = await this._courseSvc.findOneById(courseId);
		user.courses.push(course);
		return this._usersSvc.update(id, user);
	}

	@Delete(':id')
	public async remove(@Param('id') id: string) {
		return this._usersSvc.remove(id);
	}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Avatar',
		type: AvatarUploadDto,
	})
	public async uploadAvatar(
	@GetUser() user: HttpUser,
		@UploadedFile() avatar: Express.Multer.File,
	) {
		const res = await this._cloudinarySvc.uploadFile(avatar);
		await this._usersSvc.update(user._id, { avatar: res.url });
		return res;
	}
}
