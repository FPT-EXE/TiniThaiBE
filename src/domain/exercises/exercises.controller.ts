import {
	Controller,
	Get,
	Post,
	Body,
	Put,
	Param,
	Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';


@ApiBearerAuth('Bearer')
@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
	constructor(private readonly _exercisesService: ExercisesService) {}

	@Post()
	public create(@Body() createExerciseDto: CreateExerciseDto) {
		return this._exercisesService.create(createExerciseDto);
	}

	@Get()
	public findAll() {
		return this._exercisesService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string) {
		return this._exercisesService.findOne(+id);
	}

	@Put(':id')
	public update(
	@Param('id') id: string,
		@Body() updateExerciseDto: UpdateExerciseDto,
	) {
		return this._exercisesService.update(+id, updateExerciseDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string) {
		return this._exercisesService.remove(+id);
	}
}
