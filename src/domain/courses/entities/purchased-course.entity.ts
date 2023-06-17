import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Course } from './course.entity';


export type PurchasedCourseDocument = HydratedDocument<PurchasedCourse>;

export enum CourseStatus {
	Pending = 'Pending',
	Paid = 'Paid'
}

@Schema()
export class PurchasedCourse {
	public static get plural(): string {
		return 'purchasedCourses';
	}
	public static get singular(): string {
		return 'purchasedCourse';
	}

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
	public course: Course;

	@Prop({ enum: CourseStatus, default: CourseStatus.Pending })
	public status: CourseStatus;

	@Prop({ required: true })
	public purchasedDate: Date;

	@Prop({ required: true })
	public expiredDate: Date;
}

export const PurchasedCourseSchema = SchemaFactory.createForClass(PurchasedCourse);
