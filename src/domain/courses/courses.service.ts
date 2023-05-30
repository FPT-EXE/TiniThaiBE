import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './entities/course.entity';


@Injectable()
export class CoursesService {
	constructor(
		@InjectModel(Course.name) private readonly _courseModel: Model<Course>,
	) {}

	public async create(createCourseDto: CreateCourseDto) {
		return this._courseModel.create(createCourseDto);
	}

	public findAll() {
		return 'This action returns all course';
	}

	public async findOne(id: string): Promise<CourseDocument | null> {
		const course = await this._courseModel
			.findById(id)
			.orFail(() => new NotFoundException('Course not found'));
		return course;
	}

	public update(id: string, updateCourseDto: UpdateCourseDto) {
		return `This action updates a #${id} course`;
	}

	public remove(id: string) {
		return `This action removes a #${id} course`;
	}
}
