import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { PurchasedCourse } from 'src/domain/courses/entities/purchased-course.entity';
import { User } from 'src/domain/users/entities/user.entity';


export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
	public static get plural(): string {
		return 'payments';
	}
	public static get singular(): string {
		return 'payment';
	}

	@Prop({ required: true })
	public amount: number;

	@Prop({ required: true })
	public date: string;

	@Prop({ required: true })
	public content: string;

	@Prop({ required: true })
	public bankCode: string;

	@Prop({ required: true })
	public status: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	public user: User;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: PurchasedCourse.name }] })
	public purchasedCourses: Array<PurchasedCourse>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
