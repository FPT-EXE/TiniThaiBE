import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CoursesService } from '../services/courses.service';
import { CreateQuizDto } from '../dto/quiz/create-quiz.dto';
import { CourseModuleService } from '../services/course-module.service';


@ApiBearerAuth('Bearer')
@ApiTags('modules')
@Controller('modules')
export class ModulesController {
	constructor(
		private readonly _coursesSvc: CoursesService,
		private readonly _modulesSvc: CourseModuleService,
	) {}

	@Get(':id')
	public async getModuleDetails(@Param('id') id: string) {
		return this._coursesSvc.findModuleById(id);
	}

	@Post(':id/quizzes')
	public async createQuiz(
	@Param('id') id: string,
		@Body() createQuizDto: CreateQuizDto,
	) {
		return await this._modulesSvc.createQuiz(id, createQuizDto);
	}

	@Delete(':id/quizzes/:quizId')
	public async deleteCourseModule(@Param('id') id: string, @Param('quizId') quizId: string) {
		return this._modulesSvc.removeQuiz(id, quizId);
	}
}
