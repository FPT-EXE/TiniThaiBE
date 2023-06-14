import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class CreateConsonantLessonDto {
	@ApiProperty()
	@IsNotEmpty()
	public consonant: string;

	@ApiProperty()
	@IsNotEmpty()
	public symbolicWord: string;

	@ApiProperty()
	@IsNotEmpty()
	public spelling: string;

	@ApiProperty()
	@IsNotEmpty()
	public mean: string;
}
