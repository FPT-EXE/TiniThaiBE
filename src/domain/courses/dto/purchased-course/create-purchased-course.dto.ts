import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

import { Course } from '../../entities/course.entity';
import { CourseStatus } from '../../entities/purchased-course.entity';


export class CreatePurchasedCourseDto {
	@ApiProperty()
	@IsNotEmpty()
	@Type(() => Course)
	public course: Course;

	@ApiProperty()
	@IsNotEmpty()
	@IsEnum(CourseStatus)
	public status: CourseStatus;

	@ApiProperty()
	@IsNotEmpty()
	public purchasedDate: Date;

	@ApiProperty()
	@IsNotEmpty()
	public expiredDate: Date;
}
