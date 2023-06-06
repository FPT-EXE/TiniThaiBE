import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class AvatarUploadDto {
	@ApiProperty({ type: 'string', format: 'binary' })
	@IsNotEmpty()
	public avatar: any;
}
