import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { CreateQuizDto } from '../dto/quiz/create-quiz.dto';
import { CourseModule } from '../entities/course-module.entity';
import { Quiz } from '../entities/quiz.entity';


@Injectable()
export class CourseModuleService {
	constructor(
		@InjectModel(CourseModule.name) private readonly _moduleModel: Model<CourseModule>,
		@InjectModel(Quiz.name) private readonly _quizModel: Model<Quiz>,
	) {}

	public async createQuiz(
		moduleId: string,
		createQuizDto: CreateQuizDto,
	) {
		const module =  await this._moduleModel.findById(moduleId).populate(Quiz.plural);
		const quiz = await this._quizModel.create(createQuizDto);
		module.quizzes.push(quiz);
		await this._moduleModel.findByIdAndUpdate(module._id, module);
		return quiz;
	}

	public async removeQuiz(moduleId: string, quizId: string) {
		const module = await this._moduleModel.findById(moduleId);
		module.quizzes = module.quizzes.filter((id: unknown) => (id as ObjectId).toString() !== quizId);
		const deletePromise = this._quizModel.deleteOne({_id: quizId});
		const updatePromise = this._moduleModel.findByIdAndUpdate(moduleId, module);
		const promises = [deletePromise, updatePromise];
		const [deleteResult] = await Promise.all(promises);
		return deleteResult;
	}
}
