import { Module, Provider } from '@nestjs/common';
import { v2 as CloudSdk } from 'cloudinary';

import { CloudinaryService } from './cloudinary.service';

import { AppConfigModule } from 'src/application/configuration';


// const CloudinaryProvider: Provider = {
// 	provide: 'CLOUDINARY',
// 	useFactory: () => {
// 		return CloudSdk.config({
// 			cloud_name: process.env.CLOUDINARY_NAME,
// 			api_key   : process.env.CLOUDINARY_API_KEY,
// 			api_secret: process.env.CLOUDINARY_API_SECRET,
// 		});
// 	},
// };

@Module({
	imports: [AppConfigModule],
	providers: [CloudinaryService],
	exports: [CloudinaryService]
})
export class CloudinaryModule {}
