import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
	@Prop({ required: true })
	public title: string;
  
	@Prop({ required: true })
	public description: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
