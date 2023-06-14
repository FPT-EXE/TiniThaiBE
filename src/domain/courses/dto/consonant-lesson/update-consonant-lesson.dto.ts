import { PartialType } from '@nestjs/swagger';

import { CreateConsonantLessonDto } from './create-consonant-lesson.dto';


export class UpdateConsonantLessonDto extends PartialType(CreateConsonantLessonDto) {}
