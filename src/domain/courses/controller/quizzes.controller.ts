import {
	Controller,
	Get,
	Param,
	Put,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { QuizImageDto } from '../dto/quiz/quiz-img.dto';
import { QuizzesService } from '../services/quizzes.service';

import { CloudinaryService } from 'src/domain/cloudinary/cloudinary.service';


@ApiBearerAuth('Bearer')
@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
	constructor(
		private readonly _cloudinarySvc: CloudinaryService,
		private readonly _quizzesSvc: QuizzesService,
	) {}

	@Put(':id/image')
	@UseInterceptors(FileInterceptor('image'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		type: QuizImageDto,
	})
	public async uploadQuizImage(
	@Param('id') id: string,
		@UploadedFile() image: Express.Multer.File,
	) {
		const { url } = await this._cloudinarySvc.uploadFile(image);
		return await this._quizzesSvc.update(id, { image: url });
	}

	@Get(':id')
	public async findOne(@Param('id') id: string) {
		return await this._quizzesSvc.findOneById(id);
	}
}
