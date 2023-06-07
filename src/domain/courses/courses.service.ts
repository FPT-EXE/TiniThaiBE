import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './entities/course.entity';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { CourseModule } from './entities/course-module.entity';


@Injectable()
export class CoursesService {
	constructor(
		@InjectModel(Course.name) private readonly _courseModel: Model<Course>,
		@InjectModel(CourseModule.name)
		private readonly _moduleModel: Model<CourseModule>,
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

	public update(id: string, updateCourseDto: UpdateCourseDto) {
		console.log(updateCourseDto.moduleIds);
		return this._courseModel.updateOne<CourseDocument>(
			{ _id: id },
			updateCourseDto,
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
		const course = await (await this.findOne({id: courseId})).populate(CourseModule.plural);
		const module = await this._moduleModel.create({ ...moduleDto });
		course.modules.push(module);
		await this._courseModel.findByIdAndUpdate(course._id, course);
		return module;
	}
}
