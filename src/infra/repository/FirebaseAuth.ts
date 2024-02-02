import { AuthManager } from "@/application/repository/AuthManager";
import {
	Auth,
	UserCredential,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
} from "firebase/auth";

export class FirebaseAuth implements AuthManager {
	private readonly auth: Auth;

	constructor() {
		this.auth = getAuth();
	}

	async createUser(
		email: string,
		password: string
	): Promise<UserCredential["user"]["uid"]> {
		const user = await createUserWithEmailAndPassword(
			this.auth,
			email,
			password
		);
		
		return user.user.uid;
	}

	async signIn(
		email: string,
		password: string
	): Promise<UserCredential["user"]["uid"] | null> {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);

			return user.user.uid;
		} catch (error) {
			return null;
		}
	}

	async sendPasswordResetEmail(email: string): Promise<void> {
		await sendPasswordResetEmail(this.auth, email);
	}
}
