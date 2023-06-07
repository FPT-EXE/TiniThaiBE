import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ConsonantLessonDocument = HydratedDocument<ConsonantLesson>;

@Schema()
export class ConsonantLesson {
	@Prop({ required: true })
	public name: string;

	@Prop()
	public consonant: string;

	@Prop()
	public symbolicWord: string;

	@Prop()
	public spelling: string;

	@Prop()
	public mean: string;
}

export const LessonSchema = SchemaFactory.createForClass(ConsonantLesson);
