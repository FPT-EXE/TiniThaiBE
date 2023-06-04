import firebase, { app as FirebaseApp } from 'firebase-admin';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';

import { BootConfigService } from 'src/application/configuration/boot.config';


@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
	Strategy,
	'firebase-auth',
) {
	private _firebaseApp: FirebaseApp.App;

	constructor(private readonly _configSvc: BootConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		});
		this._firebaseApp = firebase.initializeApp({
			credential: firebase.credential.cert({
				clientEmail: this._configSvc.FIREBASE_CLIENT_EMAIL,
				privateKey : this._configSvc.FIREBASE_PRIVATE_KEY,
				projectId  : this._configSvc.FIREBASE_PROJECT_ID,
			}),
		});
	}

	public async validate(token: string) {
		const firebaseUser = await this._firebaseApp
			.auth()
			.verifyIdToken(token, true)
			.catch((err) => {
				console.log(err);
				throw new UnauthorizedException(err.message);
			});
		if (!firebaseUser) {
			throw new UnauthorizedException();
		}
		return firebaseUser;
	}
}
