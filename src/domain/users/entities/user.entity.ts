import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { PurchasedCourse } from '../../courses/entities/purchased-course.entity';
import { Payment } from '../../payment/entities/payment.entity';


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

	@Prop({ enum: Role })
	public role: Role;

	@Prop()
	public avatar: string;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: PurchasedCourse.name }] })
	public purchasedCourses: Array<PurchasedCourse>;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }] })
	public payments: Array<Payment>;
}

export const UserSchema = SchemaFactory.createForClass(User);
