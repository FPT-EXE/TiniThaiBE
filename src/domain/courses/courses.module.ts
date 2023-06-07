import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from './entities/course.entity';
import { CourseModule, CourseModuleSchema } from './entities/course-module.entity';
import { ModulesController } from './modules.controller';


@Module({
	imports: [
		MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
		MongooseModule.forFeature([{ name: CourseModule.name, schema: CourseModuleSchema }])
	],
	controllers: [CoursesController, ModulesController],
	providers: [CoursesService],
	exports: [CoursesService]
})
export class CoursesModule {}
