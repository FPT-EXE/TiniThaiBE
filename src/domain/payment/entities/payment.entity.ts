import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from 'src/domain/users/entities/user.entity';


export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
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

	@Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
	public user: User;

	public static get pluralName() {
		return 'payments';
	}
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
