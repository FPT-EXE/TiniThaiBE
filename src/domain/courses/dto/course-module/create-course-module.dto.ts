import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { ModuleType } from '../../entities/course-module.entity';


export class CreateCourseModuleDto {
	@ApiProperty()
	@IsNotEmpty()
	public name: string;

	@ApiProperty({enum: ModuleType})
	@IsEnum(ModuleType)
	@IsNotEmpty()
	public type: ModuleType;

	@ApiProperty()
	@IsNotEmpty()
	public order: number;
}
