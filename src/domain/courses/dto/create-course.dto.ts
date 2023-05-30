import { ApiProperty } from '@nestjs/swagger';


export class CreateCourseDto {
	@ApiProperty()
	public title: string;

	@ApiProperty()
	public description: string;
	
	@ApiProperty()
	public rating: number;
	
	@ApiProperty()
	public degreeOfDifficulty: number;
}
