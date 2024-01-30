import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { RegisterInput } from "../controller/dto/RegisterInput";
import {
	DuplicatedEmailError,
	MismatchedPasswordsError,
} from "@/error/AccountError";
import { AccountRepository } from "../repository/AccountRepository";
import { Account } from "@/domain/entities/Account";
import {
	AuthManager,
	FirebaseUserId,
} from "../repository/AuthManager";

export interface RegisterPort {
	execute(input: RegisterInput): Promise<RegisterOutput>;
}

export class RegisterOutput {
	constructor(public accountId: string) {}
}

export class Register implements RegisterPort {
	private readonly AuthManager: AuthManager;
	private readonly accountRepository: AccountRepository;

	constructor(registry: DependencyRegistry) {
		this.AuthManager = registry.inject("AuthManager");
		this.accountRepository = registry.inject("accountRepository");
	}

	async execute(input: RegisterInput): Promise<RegisterOutput> {
		if (input.password !== input.confirmPassword)
			throw new MismatchedPasswordsError();

		const isDuplicatedAccount = !!(await this.accountRepository.findByEmail(
			input.email
		));

		if (isDuplicatedAccount) throw new DuplicatedEmailError();

		const firebaseUserId: FirebaseUserId =
			await this.AuthManager.createUser(input.email, input.password);

		const account = Account.create(input, firebaseUserId);

		await this.accountRepository.save(account);

		return new RegisterOutput(account.id);
	}
}
