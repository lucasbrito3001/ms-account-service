import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { AuthManager } from "../repository/AuthManager";

export interface ResetPasswordPort {
	execute(email: string): Promise<void>;
}

export class ResetPassword implements ResetPasswordPort {
	private readonly AuthManager: AuthManager;

	constructor(registry: DependencyRegistry) {
		this.AuthManager = registry.inject("AuthManager");
	}

	async execute(email: string): Promise<void> {
		await this.AuthManager.resetPassword(email);
		return;
	}
}
