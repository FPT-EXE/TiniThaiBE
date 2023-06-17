import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsMongoId, IsNotEmpty } from 'class-validator';

import { CreatePurchasedCourseDto } from './create-purchased-course.dto';


export class UpdatePurchasedCourseDto extends PartialType(CreatePurchasedCourseDto) {
	@ApiProperty()
	@IsMongoId()
	@IsNotEmpty()
	@ArrayNotEmpty()
	public purchasedCourseId: string;
}
