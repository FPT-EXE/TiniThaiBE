import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type LessonDocument = HydratedDocument<Lesson>;

@Schema()
export class Lesson {
	@Prop({ required: true })
	public lessonId: string;

	@Prop({ required: true })
	public question: string;

	@Prop({ required: true })
	public answer: string;

	@Prop({ required: true })
	public difficulty: string;

	@Prop()
	public hint: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
