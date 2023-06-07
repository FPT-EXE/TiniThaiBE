import { Module } from '@nestjs/common';
import { ConsonantLessonService } from './consonant-lesson.service';
import { ConsonantLessonController } from './consonant-lesson.controller';

@Module({
  controllers: [ConsonantLessonController],
  providers: [ConsonantLessonService]
})
export class ConsonantLessonModule {}
