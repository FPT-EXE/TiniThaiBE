import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';



export class CreatePaymentDto {
	@Min(0)
	@ApiProperty()
	public amount: number;
}
