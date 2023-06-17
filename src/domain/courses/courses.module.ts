import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

import { CoursesService } from './services/courses.service';
import { CoursesController } from './controller/courses.controller';
import { ModulesController } from './controller/modules.controller';
import { CourseModuleService } from './services/course-module.service';
import { QuizzesService } from './services/quizzes.service';
import { QuizzesController } from './controller/quizzes.controller';
import { Course, CourseSchema } from './entities/course.entity';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import {
	CourseModule,
	CourseModuleSchema,
} from './entities/course-module.entity';
import {
	ConsonantLesson,
	ConsonantLessonSchema,
} from './entities/consonant-lesson.entity';
import { ConsonantLessonsController } from './controller/consonant-lessons.controller';
import { ConsonantLessonsService } from './services/consonant-lessons.service';
import { PurchasedCourse, PurchasedCourseSchema } from './entities/purchased-course.entity';
import { PurchasedCourseService } from './services/purchased-course.service';


@Module({
	imports: [
		MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
		MongooseModule.forFeature([
			{ name: CourseModule.name, schema: CourseModuleSchema },
		]),
		MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
		MongooseModule.forFeature([
			{ name: ConsonantLesson.name, schema: ConsonantLessonSchema },
		]),
		MongooseModule.forFeature([{ name: PurchasedCourse.name, schema: PurchasedCourseSchema }]),
		CloudinaryModule,
	],
	controllers: [
		CoursesController,
		ModulesController,
		QuizzesController,
		ConsonantLessonsController,
	],
	providers: [
		CoursesService,
		CourseModuleService,
		QuizzesService,
		ConsonantLessonsService,
		PurchasedCourseService
	],
	exports: [CoursesService, PurchasedCourseService],
})
export class CoursesModule {}
