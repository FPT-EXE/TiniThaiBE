import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { CourseModule } from './course-module.entity';



export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
	public static get plural(): string {
		return 'courses';
	}
	public static get singular(): string {
		return 'course';
	}

	@Prop({ required: true })
	public title: string;

	@Prop({ required: true })
	public alias: string;

  
	@Prop({ required: true })
	public background: string;
	
	@Prop({ required: true })
	public description: string;

	@Prop({ required: true, min: 0})
	public price: number;

	@Prop({ required: true, min: 0, max: 5 })
	public rating: number;

	@Prop({ required: true, min: 0, max: 10 })
	public degreeOfDifficulty: number;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: CourseModule.name }] })
	public modules: Array<CourseModule>;

}

export const CourseSchema = SchemaFactory.createForClass(Course);
