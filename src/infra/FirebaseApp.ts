import {
	InvalidFirebaseAppConfigError,
	MissingFirebaseAppConfigError,
} from "@/error/InfraError";
import { initializeApp, FirebaseOptions } from "firebase/app";

export class FirebaseApp {
	private readonly config: FirebaseOptions;

	constructor() {
		this.config = this.getConfig();
	}

	getConfig(): FirebaseOptions {
		if (!process.env.FIREBASE_APP_CONFIG)
			throw new MissingFirebaseAppConfigError();

		const configEnv = JSON.parse(process.env.FIREBASE_APP_CONFIG);

		const requiredKeys = [
			"apiKey",
			"authDomain",
			"projectId",
			"storageBucket",
			"messagingSenderId",
			"appId",
		];

		const areAllKeysPresent = requiredKeys.every((key) => configEnv[key]);

		if (!areAllKeysPresent) throw new InvalidFirebaseAppConfigError();

		const config: FirebaseOptions = {
			apiKey: configEnv.apiKey,
			authDomain: configEnv.authDomain,
			projectId: configEnv.projectId,
			storageBucket: configEnv.storageBucket,
			messagingSenderId: configEnv.messagingSenderId,
			appId: configEnv.appId,
		};

		return config;
	}

	initialize() {
		initializeApp(this.config);
	}
}

