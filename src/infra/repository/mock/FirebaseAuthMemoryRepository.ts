import {
	AuthManager,
	FirebaseUserId,
} from "@/application/repository/AuthManager";

export class FirebaseAuthMemoryRepository implements AuthManager {
	private firebaseAccounts: any[] = [];

	async createUser(email: string, password: string): Promise<FirebaseUserId> {
		const id = "0";
		this.firebaseAccounts.push({ id, email, password });

		return id;
	}

	async signIn(
		email: string,
		password: string
	): Promise<FirebaseUserId | null> {
		const account = this.firebaseAccounts.find(
			(account) => account.email === email
		);

		if (account === undefined || account.password !== password) return null;

		return account.id;
	}

	async sendPasswordResetEmail(email: string): Promise<void> {
		return;
	}
}
