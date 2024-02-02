import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { AuthManager } from "../repository/AuthManager";
import { Authentication } from "@/domain/entities/Auth";
import { AccountRepository } from "../repository/AccountRepository";
import { BadCredentialsError } from "@/error/AuthError";
import { AuthManagerAndDatabaseInconsistencyError } from "@/error/AccountError";

export interface SignInPort {
	execute(email: string, password: string): Promise<SignInOutput>;
}

export class SignInOutput {
	constructor(public token: string) {}
}

export class SignIn implements SignInPort {
	private readonly authManager: AuthManager;
	private readonly accountRepository: AccountRepository;

	constructor(registry: DependencyRegistry) {
		this.authManager = registry.inject("authManager");
		this.accountRepository = registry.inject("accountRepository");
	}

	async execute(email: string, password: string): Promise<SignInOutput> {
		const firebaseId = await this.authManager.signIn(email, password);

		if (firebaseId === null) throw new BadCredentialsError();

		const account = await this.accountRepository.findByEmail(email);

		if (account === null) throw new AuthManagerAndDatabaseInconsistencyError();

		const auth = Authentication.create(account.id, firebaseId, email);

		return new SignInOutput(auth.token);
	}
}
