import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';


export class CreateCourseDto {
	@IsNotEmpty()
	@ApiProperty()
	public title: string;

	@IsNotEmpty()
	@ApiProperty()
	public alias: string;

	@ApiProperty()
	public description: string;
	
	@Min(0)
	@Max(5)
	@ApiProperty()
	public ratig: number;
	
	@Min(0)
	@Max(10)
	@ApiProperty()
	public degreeOfDifficulty: number;
}
