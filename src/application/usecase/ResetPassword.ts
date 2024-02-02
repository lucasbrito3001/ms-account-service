import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { AuthManager } from "../repository/AuthManager";

export interface ResetPasswordPort {
	execute(email: string): Promise<void>;
}

export class ResetPassword implements ResetPasswordPort {
	private readonly authManager: AuthManager;

	constructor(registry: DependencyRegistry) {
		this.authManager = registry.inject("authManager");
	}

	async execute(email: string): Promise<void> {
		await this.authManager.sendPasswordResetEmail(email);
	}
}
