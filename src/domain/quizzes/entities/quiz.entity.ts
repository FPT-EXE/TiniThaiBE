import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
	@Prop({ required: true })
	public name: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
