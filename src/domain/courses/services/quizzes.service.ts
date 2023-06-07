import { Injectable } from '@nestjs/common';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Quiz, QuizDocument } from '../entities/quiz.entity';
import { UpdateQuizDto } from '../dto/quiz/update-quiz.dto';


@Injectable()
export class QuizzesService {
	constructor(
		@InjectModel(Quiz.name) private readonly _quizModel: Model<Quiz>,
	) {}

	public async update(
		id: string,
		updateQuizDto: UpdateQuizDto,
	): Promise<UpdateWriteOpResult> {
		return this._quizModel.updateOne<QuizDocument>({ _id: id }, updateQuizDto, {
			new: true,
		});
	}

	public async findOneById(id: string) {
		return this._quizModel.findById(id);
	}
}
