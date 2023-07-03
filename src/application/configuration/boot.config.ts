import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class BootConfigService {
	constructor(private _configService: ConfigService) {}

	public get isRunLocal(): boolean {
		const localEnvs = new Set()
			.add('local')
			.add(undefined)
			.add('')
			.add('test');
		return localEnvs.has(this.NODE_ENV);
	}

	public get GIT_SHA(): string {
		return this._configService.get('GIT_SHA');
	}

	public get PORT(): number {
		return Number(this._configService.get('PORT') || 3000);
	}

	public get NODE_ENV(): string {
		return this._configService.get('NODE_ENV');
	}

	public get APP_NAME(): string {
		return this._configService.get('NODE_ENV');
	}

	public get FRONTEND_DOMAIN(): string {
		return this.NODE_ENV === 'local'
			? this._configService.get('LOCAL_FRONTEND_DOMAIN')
			: this._configService.get('FRONTEND_DOMAIN');
	}

	public get JWT_EXPIRES_IN(): string {
		return this._configService.get('JWT_EXPIRES_IN');
	}

	public get JWT_SECRET(): string {
		return this._configService.get('JWT_SECRET');
	}

	public get COOKIE_SECRET(): string {
		return this._configService.get('COOKIE_SECRET');
	}

	public get LOCAL_MONGODB_URI(): string {
		return this._configService.get('LOCAL_MONGODB_URI');
	}

	public get REMOTE_MONGODB_URI(): string {
		return this._configService.get('REMOTE_MONGODB_URI');
	}

	public get MDB_NAME(): string {
		return this._configService.get('MDB_NAME');
	}

	public get CERT_PATH(): string {
		return this._configService.get('CERT_PATH');
	}

	public get VNP_URL(): string {
		return this._configService.get('VNP_URL');
	}

	public get VNP_RETURN_URL(): string {
		return this._configService.get('VNP_RETURN_URL');
	}

	public get VNP_HASHSECRET(): string {
		return this._configService.get('VNP_HASHSECRET');
	}

	public get VNP_TMNCODE(): string {
		return this._configService.get('VNP_TMNCODE');
	}

	public get FIREBASE_TYPE(): string {
		return this._configService.get('FIREBASE_TYPE');
	}

	public get FIREBASE_PROJECT_ID(): string {
		return this._configService.get('FIREBASE_PROJECT_ID');
	}

	public get FIREBASE_PRIVATE_KEY_ID(): string {
		return this._configService.get('FIREBASE_PRIVATE_KEY_ID');
	}

	public get FIREBASE_PRIVATE_KEY(): string {
		return this._configService
			.get('FIREBASE_PRIVATE_KEY')
			.replace(/\\n/gm, '\n');
	}

	public get FIREBASE_CLIENT_EMAIL(): string {
		return this._configService.get('FIREBASE_CLIENT_EMAIL');
	}

	public get FIREBASE_CLIENT_ID(): string {
		return this._configService.get('FIREBASE_CLIENT_ID');
	}

	public get FIREBASE_AUTH_URI(): string {
		return this._configService.get('FIREBASE_AUTH_URI');
	}

	public get FIREBASE_TOKEN_URI(): string {
		return this._configService.get('FIREBASE_TOKEN_URI');
	}

	public get FIREBASE_AUTH_PROVIDER_X509(): string {
		return this._configService.get('FIREBASE_AUTH_PROVIDER_X509');
	}

	public get FIREBASE_CLIENT_X509(): string {
		return this._configService.get('FIREBASE_CLIENT_X509');
	}

	public get FIREBASE_UNIVERSAL_DOMAIN(): string {
		return this._configService.get('FIREBASE_UNIVERSAL_DOMAIN');
	}

	public get CLOUDINARY_NAME(): string {
		return this._configService.get('CLOUDINARY_NAME');
	}

	public get CLOUDINARY_API_KEY(): string {
		return this._configService.get('CLOUDINARY_API_KEY');
	}

	public get CLOUDINARY_API_SECRET(): string {
		return this._configService.get('CLOUDINARY_API_SECRET');
	}
}
