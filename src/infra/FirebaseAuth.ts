import { AuthManager } from "@/application/repository/AuthManager";
import { Auth, createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export class FirebaseAuth implements AuthManager {
	private readonly auth: Auth;

	constructor() {
		this.auth = getAuth();
	}

	async createUser(email: string, password: string): Promise<string> {
		const user = await createUserWithEmailAndPassword(
			this.auth,
			email,
			password
		);
        
		return user.user.uid;
	}
	signIn(email: string, password: string): Promise<string | null> {
		throw new Error("Method not implemented.");
	}
	resetPassword(email: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
