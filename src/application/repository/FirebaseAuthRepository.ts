export type FirebaseUserId = string;

export interface FirebaseAuthRepository {
	createUser(email: string, password: string): Promise<FirebaseUserId>;
	signIn(email: string, password: string): Promise<FirebaseUserId | null>;
}
