import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';

import {
	CourseStatus,
	PurchasedCourse,
	PurchasedCourseDocument,
} from '../entities/purchased-course.entity';
import { CreatePurchasedCourseDto } from '../dto/purchased-course/create-purchased-course.dto';
import { UpdatePurchasedCourseDto } from '../dto/purchased-course/update-purchased-course.dto.';
import { Course } from '../entities/course.entity';


@Injectable()
export class PurchasedCourseService {
	constructor(
		@InjectModel(PurchasedCourse.name)
		private readonly _pCrsModel: Model<PurchasedCourse>,
	) {}

	public async create(
		createPCourseDtos: CreatePurchasedCourseDto[],
	): Promise<PurchasedCourseDocument[]> {
		return await this._pCrsModel.create(createPCourseDtos);
	}

	public async createPurchases(courses: Course[]) {
		const purchasedDate = new Date();
		const duration =  60;
		const expiredDate = new Date(purchasedDate.getTime() + duration * 24 * 60 * 60 * 1000); // update plan later
		const pCourses: CreatePurchasedCourseDto[] = courses.map(c => ({
			course: c,
			purchasedDate,
			expiredDate,
			status: CourseStatus.Pending
		}));
		return await this.create(pCourses);
	}

	public async updateMany(
		ids: string[],
		updatePCourseDto: UpdatePurchasedCourseDto,
	): Promise<UpdateWriteOpResult> {
		return await this._pCrsModel.updateMany<PurchasedCourseDocument>(
			{
				_id: {
					$in: ids,
				},
			},
			updatePCourseDto,
			{
				new: true,
			},
		);
	}
}
