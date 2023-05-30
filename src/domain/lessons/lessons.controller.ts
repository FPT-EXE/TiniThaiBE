import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';


@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
	constructor(private readonly _lessonsService: LessonsService) {}

	@Post()
	public create(@Body() createLessonDto: CreateLessonDto) {
		return this._lessonsService.create(createLessonDto);
	}

	@Get()
	public findAll() {
		return this._lessonsService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string) {
		return this._lessonsService.findOne(+id);
	}

	@Put(':id')
	public update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
		return this._lessonsService.update(+id, updateLessonDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string) {
		return this._lessonsService.remove(+id);
	}
}
