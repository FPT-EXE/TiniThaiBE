import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Redirect,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';


@ApiTags('courses')
@Controller('courses')
export class CoursesController {
	constructor(private readonly _coursesService: CoursesService) {}

	@Post()
	public create(@Body() createCourseDto: CreateCourseDto) {
		return this._coursesService.create(createCourseDto);
	}

	@Get()
	public findAll() {
		return this._coursesService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string) {
		return this._coursesService.findOne(+id);
	}

	@Patch(':id')
	public update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
		return this._coursesService.update(+id, updateCourseDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string) {
		return this._coursesService.remove(+id);
	}
}
