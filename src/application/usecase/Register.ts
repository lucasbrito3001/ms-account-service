import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { RegisterInput } from "../controller/dto/RegisterInput";
import {
	DuplicatedEmailError,
	MismatchedPasswordsError,
} from "@/error/AccountError";
import { AccountRepository } from "../repository/AccountRepository";
import { Account } from "@/domain/entities/Account";
import { AuthManager, FirebaseUserId } from "../repository/AuthManager";
import { Queue } from "@/infra/queue/Queue";
import { AccountRegistered } from "@/domain/event/AccountRegistered";

export interface RegisterPort {
	execute(input: RegisterInput): Promise<RegisterOutput>;
}

export class RegisterOutput {
	constructor(public accountId: string) {}
}

export class Register implements RegisterPort {
	private readonly queue: Queue;
	private readonly authManager: AuthManager;
	private readonly accountRepository: AccountRepository;

	constructor(registry: DependencyRegistry) {
		this.queue = registry.inject("queue");
		this.authManager = registry.inject("authManager");
		this.accountRepository = registry.inject("accountRepository");
	}

	async execute(input: RegisterInput): Promise<RegisterOutput> {
		if (input.password !== input.confirmPassword)
			throw new MismatchedPasswordsError();

		const isDuplicatedAccount = !!(await this.accountRepository.findByEmail(
			input.email
		));

		if (isDuplicatedAccount) throw new DuplicatedEmailError();

		const firebaseUserId: FirebaseUserId = await this.authManager.createUser(
			input.email,
			input.password
		);

		const account = Account.create(input, firebaseUserId);

		await this.accountRepository.save(account);
		await this.queue.publish(
			"accountRegistered",
			new AccountRegistered(
				account.id,
				account.firstName,
				account.lastName,
				account.email
			)
		);

		return new RegisterOutput(account.id);
	}
}
