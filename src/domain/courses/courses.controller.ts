import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Param,
	Delete,
	Redirect,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';


@ApiBearerAuth('Bearer')
@ApiTags('courses')
@Controller('courses')
export class CoursesController {
	constructor(private readonly _coursesService: CoursesService) {}

	@Post()
	public async create(@Body() createCourseDto: CreateCourseDto) {
		return this._coursesService.create(createCourseDto);
	}

	@Get()
	public async findAll() {
		return this._coursesService.findAll();
	}

	@Get(':id')
	public async findOne(@Param('id') id: string) {
		return this._coursesService.findOne(id);
	}

	@Put(':id')
	public async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
		return this._coursesService.update(id, updateCourseDto);
	}

	@Delete(':id')
	public async remove(@Param('id') id: string) {
		return this._coursesService.remove(id);
	}
}
