import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';


export class CreateQuizDto {
	@ApiProperty()
	@IsNotEmpty()
	public question: string;

	@ApiProperty({ type: [String] })
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	public choices: string[];
	
	@ApiProperty({ type: [String] })
	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	public answers: string[];
}
