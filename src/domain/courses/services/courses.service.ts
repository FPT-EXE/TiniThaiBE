import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { CreateCourseDto } from '../dto/course/create-course.dto';
import { UpdateCourseDto } from '../dto/course/update-course.dto';
import { Course, CourseDocument } from '../entities/course.entity';
import { CreateCourseModuleDto } from '../dto/course-module/create-course-module.dto';
import { CourseModule } from '../entities/course-module.entity';

import { CourseModuleService } from './course-module.service';


@Injectable()
export class CoursesService {
	constructor(
		@InjectModel(Course.name) 		private readonly _courseModel: Model<Course>,
		@InjectModel(CourseModule.name) private readonly _moduleModel: Model<CourseModule>,
		private readonly _moduleSvc: CourseModuleService
	) {}

	public async create(createCourseDto: CreateCourseDto) {
		return this._courseModel.create(createCourseDto);
	}

	public findAll() {
		return this._courseModel.find();
	}

	public async findOneById(id: string): Promise<CourseDocument | null> {
		const course = await this._courseModel
			.findById(id)
			.orFail(() => new NotFoundException('Course not found'));
		return course;
	}

	public async findOne(
		filter: FilterQuery<CourseDocument | null>,
	): Promise<CourseDocument> {
		const user = await this._courseModel.findOne(filter);
		return user;
	}

	public async update(id: string, updateCourseDto: UpdateCourseDto) {
		let modules: CourseModule[];
		const { moduleIds } = updateCourseDto;
		if (Boolean(moduleIds) && Boolean(moduleIds.length)) {
			modules = (await (await this.findOne({ id })).populate(CourseModule.plural)).modules || [];
			const promises = moduleIds.map((id) => this._moduleSvc.findModuleById(id));
			const addedModules = await Promise.all(promises);
			modules.push(...addedModules);
		}
		delete updateCourseDto.moduleIds;
		return this._courseModel.updateOne<CourseDocument>(
			{ _id: id },
			{
				...updateCourseDto,
				modules,
			},
			{
				new: true,
			},
		);
	}

	public remove(id: string) {
		return this._courseModel.deleteOne({ _id: id });
	}

	public async createCourseModule(
		courseId: string,
		moduleDto: CreateCourseModuleDto,
	) {
		const course = await (await this.findOne({ id: courseId })).populate(CourseModule.plural);
		const module = await this._moduleModel.create(moduleDto);
		course.modules.push(module);
		await this._courseModel.findByIdAndUpdate(course._id, course);
		return module;
	}

	public async deleteCourseModule(id: string, moduleId: string) {
		const course = await this.findOneById(id);
		course.modules = course.modules.filter((id: unknown) => (id as ObjectId).toString() !== moduleId);
		const deletePromise = this._moduleModel.deleteOne({_id: moduleId});
		const updatePromise = this._courseModel.findByIdAndUpdate(course._id, course);
		const promises = [deletePromise, updatePromise];
		const [deleteResult] = await Promise.all(promises);
		return deleteResult;
	}
}
