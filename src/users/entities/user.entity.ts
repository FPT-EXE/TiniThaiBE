import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export enum Role {
	Admin,
	Learner,
	Teacher,
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
}

export const UserSchema = SchemaFactory.createForClass(User);
