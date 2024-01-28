import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { FirebaseAuthRepository } from "../repository/FirebaseAuthRepository";

export interface ResetPasswordPort {
	execute(email: string): Promise<void>;
}

export class ResetPassword implements ResetPasswordPort {
	private readonly firebaseAuthRepository: FirebaseAuthRepository;

	constructor(registry: DependencyRegistry) {
		this.firebaseAuthRepository = registry.inject("firebaseAuthRepository");
	}

	async execute(email: string): Promise<void> {
		await this.firebaseAuthRepository.resetPassword(email);
		return;
	}
}
