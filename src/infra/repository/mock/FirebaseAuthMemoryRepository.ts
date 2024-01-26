import {
	FirebaseAuthRepository,
	FirebaseUserId,
} from "@/application/repository/FirebaseAuthRepository";

export class FirebaseAuthMemoryRepository implements FirebaseAuthRepository {
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
}
