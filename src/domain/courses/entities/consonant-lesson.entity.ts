import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ConsonantLessonDocument = HydratedDocument<ConsonantLesson>;

@Schema()
export class ConsonantLesson {
	public static get plural(): string {
		return 'consonantLessons';
	}
	public static get singular(): string {
		return 'consonantLesson';
	}

	@Prop({ required: true })
	public consonant: string;

	@Prop({ required: true })
	public symbolicWord: string;

	@Prop({ required: true })
	public spelling: string;

	@Prop({ required: true })
	public mean: string;
}

export const ConsonantLessonSchema = SchemaFactory.createForClass(ConsonantLesson);
