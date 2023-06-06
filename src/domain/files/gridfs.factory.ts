import { Injectable } from '@nestjs/common';
import {
	MulterModuleOptions,
	MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage/lib/gridfs';



@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
	private _gridFsStorage: GridFsStorage;
	constructor() {
		this._gridFsStorage = new GridFsStorage({
			url: 'mongodb://localhost/yourDB',
			file: (req, file) => {
				return new Promise((resolve, _reject) => {
					const filename = file.originalname.trim();
					const fileInfo = {
						filename: filename,
					};
					resolve(fileInfo);
				});
			},
		});
	}

	public createMulterOptions(): MulterModuleOptions {
		return {
			storage: this._gridFsStorage,
		};
	}
}
