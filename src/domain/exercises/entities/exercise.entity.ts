import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
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

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
