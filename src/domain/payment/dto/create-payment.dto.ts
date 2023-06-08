import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsMongoId, IsNotEmpty, Min } from 'class-validator';



export class CreatePaymentDto {
	@ApiProperty()
	@IsMongoId({each: true})
	@IsNotEmpty({each: true})
	@ArrayNotEmpty()
	public courseIds: string[];
}
