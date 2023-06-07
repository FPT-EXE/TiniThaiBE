import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';


@Module({
	providers: [CloudinaryProvider, CloudinaryService],
	exports: [CloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule {}
