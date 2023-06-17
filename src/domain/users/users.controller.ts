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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUser } from '../auth/decorators';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PurchasedCourse } from '../courses/entities/purchased-course.entity';

import { AvatarUploadDto } from './dto/avatar.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpUser } from './entities/user.entity';


@ApiBearerAuth('Bearer')
@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly _usersSvc: UsersService,
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
