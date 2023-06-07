
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';



export class RegisterCourseDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsMongoId()
	public courseId: string;
}
