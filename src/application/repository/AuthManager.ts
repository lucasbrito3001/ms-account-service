export type FirebaseUserId = string;

export interface AuthManager {
	createUser(email: string, password: string): Promise<FirebaseUserId>;
	signIn(email: string, password: string): Promise<FirebaseUserId | null>;
	sendPasswordResetEmail(email: string): Promise<void>;
}
