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
	
	@ApiProperty()
	public background: string;
	
	@ApiProperty()
	@Min(0)
	public price: number;

	@Min(0)
	@Max(5)
	@ApiProperty()
	public rating: number;
	
	@Min(0)
	@Max(10)
	@ApiProperty()
	public degreeOfDifficulty: number;
}
