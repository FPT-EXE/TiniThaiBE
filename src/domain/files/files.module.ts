import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { FilesService  } from '././files.service';
import { GridFsMulterConfigService } from './gridfs.factory';


@Module({
	imports: [
		MulterModule.registerAsync({
			useClass: GridFsMulterConfigService,
		}),
	],
	providers: [GridFsMulterConfigService, FilesService],
	exports: [FilesService]
})
export class FilesModule {}

