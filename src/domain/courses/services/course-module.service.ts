import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { DeleteResult } from 'mongodb';

import { CourseModule, CourseModuleDocument, ModuleType } from '../entities/course-module.entity';
import { Quiz } from '../entities/quiz.entity';
import { ConsonantLesson } from '../entities/consonant-lesson.entity';


@Injectable()
export class CourseModuleService {
	private readonly _models = {
		[ModuleType.Quiz]           : this._quizModel,
		[ModuleType.ConsonantLesson]: this._cnsLsModel
	};

	constructor(
		@InjectModel(CourseModule.name)    private readonly _moduleModel: Model<CourseModule>,
		@InjectModel(Quiz.name) 		   private readonly _quizModel  : Model<Quiz>,
		@InjectModel(ConsonantLesson.name) private readonly _cnsLsModel : Model<ConsonantLesson>,
	) {}

	public async findModuleById(id: string): Promise<CourseModuleDocument | null> {
		let module = await this._moduleModel
			.findById(id)
			.orFail(() => new NotFoundException('Module not found'));
		module = await module.populate(module.type);
		return module;
	}

	public async createLesson<T extends object>(moduleId: string, lsDto: T) {
		const module = await this.findModuleById(moduleId);
		const ls     = await this._models[module.type].create(lsDto);
		module[module.type].push(ls);
		await this._moduleModel.findByIdAndUpdate(module._id, module);
		return ls;
	}

	public async removeLesson(moduleId: string, lsId: string) {
		const module         = await this.findModuleById(moduleId);
		module[module.type]  = module[module.type].filter((id: unknown) => (id as ObjectId).toString() !== lsId);
		const deletePromise  = this._models[module.type].deleteOne({_id: lsId});
		const updatePromise  = this._moduleModel.findByIdAndUpdate(moduleId, module);
		const promises       = [deletePromise, updatePromise];
		const [deleteResult] = await Promise.all(promises);
		return deleteResult as DeleteResult;
	}
}
