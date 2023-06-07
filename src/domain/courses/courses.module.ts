import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

import { CoursesService } from './services/courses.service';
import { CoursesController } from './controller/courses.controller';
import { Course, CourseSchema } from './entities/course.entity';
import { CourseModule, CourseModuleSchema } from './entities/course-module.entity';
import { ModulesController } from './controller/modules.controller';
import { CourseModuleService } from './services/course-module.service';
import { QuizzesService } from './services/quizzes.service';
import { QuizzesController } from './controller/quizzes.controller';
import { Quiz, QuizSchema } from './entities/quiz.entity';


@Module({
	imports: [
		MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
		MongooseModule.forFeature([{ name: CourseModule.name, schema: CourseModuleSchema }]),
		MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
		CloudinaryModule
	],
	controllers: [CoursesController, ModulesController, QuizzesController],
	providers: [CoursesService, CourseModuleService, QuizzesService],
	exports: [CoursesService]
})
export class CoursesModule {}
