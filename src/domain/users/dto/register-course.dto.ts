
import { ApiProperty } from '@nestjs/swagger';


export class RegisterCourseDto {
	@ApiProperty()
	public courseId: string;
}
