import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateQuizDto } from '../dto/quiz/create-quiz.dto';
import { CourseModuleService } from '../services/course-module.service';
import { CreateConsonantLessonDto } from '../dto/consonant-lesson/create-consonant-lesson.dto';


@ApiBearerAuth('Bearer')
@ApiTags('modules')
@Controller('modules')
export class ModulesController {
	constructor(
		private readonly _modulesSvc: CourseModuleService,
	) {}

	@Get(':id')
	public async getModuleDetails(@Param('id') id: string) {
		return this._modulesSvc.findModuleById(id);
	}

	@Post(':id/quizzes')
	public async createQuiz(
	@Param('id') id: string,
		@Body() createQuizDto: CreateQuizDto,
	) {
		return await this._modulesSvc.createLesson(id, createQuizDto);
	}

	@Delete(':id/quizzes/:quizId')
	public async deleteCourseModule(@Param('id') id: string, @Param('quizId') quizId: string) {
		return this._removeLesson(id, quizId);
	}

	@Post(':id/consonant-lessons')
	public async createConsonantLesson(
	@Param('id') id: string,
		@Body() cnsLsDto: CreateConsonantLessonDto,
	) {
		return await this._modulesSvc.createLesson(id, cnsLsDto);
	}

	@Delete(':id/consonant-lessons/:lessonId')
	public async deleteLesson(@Param('id') id: string, @Param('lessonId') lessonId: string) {
		return await this._removeLesson(id, lessonId);
	}

	private async _removeLesson(moduleId: string, lsId: string) {
		const result = await this._modulesSvc.removeLesson(moduleId, lsId);
		if (!result.deletedCount) {
			throw new BadRequestException('Entity not found');
		}
		return result;
	}
}
