import { Injectable } from '@nestjs/common';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';


@Injectable()
export class ExercisesService {
	public create(createExerciseDto: CreateExerciseDto) {
		return 'This action adds a new exercise';
	}

	public findAll() {
		return 'This action returns all exercises';
	}

	public findOne(id: number) {
		return `This action returns a #${id} exercise`;
	}

	public update(id: number, updateExerciseDto: UpdateExerciseDto) {
		return `This action updates a #${id} exercise`;
	}

	public remove(id: number) {
		return `This action removes a #${id} exercise`;
	}
}
