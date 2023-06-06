import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/decorators';

import { FilesService } from './files.service';


@ApiBearerAuth('Bearer')
@ApiTags('files')
@Controller('files')
export class FilesController {
	constructor(private readonly _filesSvc: FilesService) {}

	@Public()
	@Get()
	public async findAll() {
		return await this._filesSvc.findAll();
	}

	@Public()
	@Get(':id')
	public async findOne(@Param('id') id: string) {
		return await this._filesSvc.findOne(id);
	}

	@Public()
	@Delete(':id')
	public async delete(@Param('id') id: string) {
		return await this._filesSvc.deleteFile(id);
	}
}
