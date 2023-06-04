import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';



export class CreatePaymentDto {
	@Min(0)
	@ApiProperty()
	public amount: number;
}
