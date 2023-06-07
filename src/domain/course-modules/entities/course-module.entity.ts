import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ConsonantLesson } from 'src/domain/consonant-lesson/entities/consonant-lesson.entity';
import { Quiz } from 'src/domain/quizzes/entities/quiz.entity';


export type CourseModuleDocument = HydratedDocument<CourseModule>;

export enum ModuleType {
	ConsonantLesson   = 'consonantLesson',
	VowelLesson       = 'vowelLesson',
	SentenceStructure = 'sentenceStructure',
	Quiz              = 'quiz'
}

@Schema()
export class CourseModule {
	@Prop({ required: true })
	public name: string;

	@Prop()
	public totalLesson: number;

	@Prop()
	public currentProgress: number;

	@Prop({enum: ModuleType})
	public type: ModuleType;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: ConsonantLesson.name }] })
	public lessons: Array<ConsonantLesson>;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Quiz.name }] })
	public quizzes: Array<Quiz>;
}

export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);
