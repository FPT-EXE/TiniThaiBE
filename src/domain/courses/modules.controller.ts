import {
	Controller,
	Get,
	Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CoursesService } from './courses.service';


@ApiBearerAuth('Bearer')
@ApiTags('courses')
@Controller('modules')
export class ModulesController {
	constructor(private readonly _coursesService: CoursesService) {}

	@Get(':id')
	public async getModuleDetails(@Param('id') id: string) {
		return this._coursesService.findModuleById(id);
	}
}
