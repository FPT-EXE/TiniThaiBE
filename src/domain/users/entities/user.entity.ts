import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Course } from 'src/domain/courses/entities/course.entity';


export enum Role {
	Admin = 'Admin',
	Learner = 'Learner',
	Teacher = 'Teacher',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ required: true })
	public name: string;

	@Prop({ required: true })
	public email: string;

	@Prop({ required: true })
	public password: string;

	@Prop({ required: true, enum: Role, default: Role.Learner })
	public role: Role;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }] })
	public courses: Array<Course>;
}

export const UserSchema = SchemaFactory.createForClass(User);
