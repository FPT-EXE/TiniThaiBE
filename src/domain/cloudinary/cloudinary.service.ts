import { Injectable } from '@nestjs/common';
import { v2 as CloudSdk } from 'cloudinary';
import streamifier from 'streamifier';

import { CloudinaryResponse } from './cloudinary-response';

import { BootConfigService } from 'src/application/configuration';


@Injectable()
export class CloudinaryService {
	constructor(private readonly _configSvc: BootConfigService) {
		CloudSdk.config({
			cloud_name: this._configSvc.CLOUDINARY_NAME,
			api_key   : this._configSvc.CLOUDINARY_API_KEY,
			api_secret: this._configSvc.CLOUDINARY_API_SECRET,
		});
	}

	public uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			const uploadStream = CloudSdk.uploader.upload_stream({
				folder: this._configSvc.APP_NAME
			},
			(error, result) => {
				if (error) return reject(error);
				resolve(result);
			},
			);
			streamifier.createReadStream(file.buffer).pipe(uploadStream);
		});
	}
}
