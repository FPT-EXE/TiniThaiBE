
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

import { toMongoObjectId } from '../../../application/utils';


export class RegisterCourseDto {
	@ApiProperty()
	@IsNotEmpty()
	@Type(() => Types.ObjectId)
	@Transform(toMongoObjectId)
	public courseId: string;
}
