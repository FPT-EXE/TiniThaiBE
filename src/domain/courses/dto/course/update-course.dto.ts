import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

import { CreateCourseDto } from './create-course.dto';


export class UpdateCourseDto extends PartialType(CreateCourseDto) {
	@ApiProperty()
	@IsMongoId({each: true})
	@IsOptional()
	public moduleIds: string[];
}
