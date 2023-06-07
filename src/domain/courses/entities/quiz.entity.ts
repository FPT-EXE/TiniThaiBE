import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
	public static get plural(): string {
		return 'quizzes';
	}
	public static get singular(): string {
		return 'quiz';
	}

	@Prop({ required: true })
	public question: string;

	@Prop()
	public image: string;

	@Prop({ required: true, type: [String] })
	public choices: Array<string>;

	@Prop({ required: true, type: [String] })
	public answers: Array<string>;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
