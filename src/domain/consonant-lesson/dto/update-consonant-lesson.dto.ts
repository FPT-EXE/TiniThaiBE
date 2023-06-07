import { PartialType } from '@nestjs/mapped-types';
import { CreateConsonantLessonDto } from './create-consonant-lesson.dto';

export class UpdateConsonantLessonDto extends PartialType(CreateConsonantLessonDto) {}
