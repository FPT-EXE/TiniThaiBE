import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { Course } from '../../courses/entities/course.entity';

import { Payment } from 'src/domain/payment/entities/payment.entity';


export enum Role {
	Admin = 'Admin',
	Learner = 'Learner',
	Teacher = 'Teacher',
}

export type UserDocument = HydratedDocument<User>;

export type HttpUser = {
	_id: string,
	email: string,
	role: Role,
};

@Schema()
export class User {
	public static get plural(): string {
		return 'users';
	}
	public static get singular(): string {
		return 'user';
	}

	public name: string;

	@Prop({ required: true })
	public email: string;

	@Prop({ enum: Role, default: Role.Learner })
	public role: Role;

	@Prop({ type: mongoose.Schema.Types.ObjectId })
	public avatar: Types.ObjectId;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }] })
	public courses: Array<Course>;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }] })
	public payments: Array<Payment>;
}

export const UserSchema = SchemaFactory.createForClass(User);
