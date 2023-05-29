import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop()
	public name: string;

	@Prop()
	public age: number;

	@Prop()
	public breed: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
