import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Param,
	Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CoursesService } from '../services/courses.service';
import { CreateCourseDto } from '../dto/course/create-course.dto';
import { UpdateCourseDto } from '../dto/course/update-course.dto';
import { CreateCourseModuleDto } from '../dto/course-module/create-course-module.dto';


@ApiBearerAuth('Bearer')
@ApiTags('courses')
@Controller('courses')
export class CoursesController {
	constructor(private readonly _coursesSvc: CoursesService) {}

	@Post()
	public async create(@Body() createCourseDto: CreateCourseDto) {
		return this._coursesSvc.create(createCourseDto);
	}

	@Get()
	public async findAll() {
		return this._coursesSvc.findAll();
	}

	@Get(':id')
	public async findOne(@Param('id') id: string) {
		return this._coursesSvc.findOneById(id);
	}

	@Put(':id')
	public async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
		return this._coursesSvc.update(id, updateCourseDto);
	}

	@Delete(':id')
	public async remove(@Param('id') id: string) {
		return this._coursesSvc.remove(id);
	}

	@Post(':id/modules')
	public async createCourseModule(@Param('id') id: string, @Body() moduleDto: CreateCourseModuleDto) {
		return this._coursesSvc.createCourseModule(id, moduleDto);
	}

	@Delete(':id/modules/:moduleId')
	public async deleteCourseModule(@Param('id') id: string, @Param('moduleId') moduleId: string) {
		return this._coursesSvc.deleteCourseModule(id, moduleId);
	}

}
