import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Quiz } from './quiz.entity';

import { ConsonantLesson } from 'src/domain/consonant-lesson/entities/consonant-lesson.entity';


export type CourseModuleDocument = HydratedDocument<CourseModule>;

export enum ModuleType {
	ConsonantLesson   = 'consonantLessons',
	VowelLesson       = 'vowelLessons',
	SentenceStructure = 'sentenceStructures',
	Quiz              = 'quizzes'
}

@Schema()
export class CourseModule {
	public static get plural(): string {
		return 'modules';
	}
	public static get singular(): string {
		return 'module';
	}

	@Prop({ required: true })
	public name: string;

	// @Prop()
	// public totalLesson: number;

	// @Prop()
	// public currentProgress: number;

	@Prop()
	public order: number;

	@Prop({enum: ModuleType})
	public type: ModuleType;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: ConsonantLesson.name }] })
	public consonantLessons: Array<ConsonantLesson>;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Quiz.name }] })
	public quizzes: Array<Quiz>;
}

export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);
