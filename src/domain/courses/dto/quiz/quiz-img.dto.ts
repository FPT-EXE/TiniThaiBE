import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class QuizImageDto {
	@ApiProperty({ type: 'string', format: 'binary' })
	@IsNotEmpty()
	public image: string;
}
