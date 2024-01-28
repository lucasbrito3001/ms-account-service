import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { RegisterInput } from "../controller/dto/RegisterInput";
import {
	DuplicatedEmailError,
	MismatchedPasswordsError,
} from "@/error/AccountError";
import { AccountRepository } from "../repository/AccountRepository";
import { Account } from "@/domain/entities/Account";
import {
	FirebaseAuthRepository,
	FirebaseUserId,
} from "../repository/FirebaseAuthRepository";

export interface RegisterPort {
	execute(input: RegisterInput): Promise<RegisterOutput>;
}

export class RegisterOutput {
	constructor(public accountId: string) {}
}

export class Register implements RegisterPort {
	private readonly firebaseAuthRepository: FirebaseAuthRepository;
	private readonly accountRepository: AccountRepository;

	constructor(registry: DependencyRegistry) {
		this.firebaseAuthRepository = registry.inject("firebaseAuthRepository");
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
			await this.firebaseAuthRepository.createUser(input.email, input.password);

		const account = Account.create(input, firebaseUserId);

		await this.accountRepository.save(account);

		return new RegisterOutput(account.id);
	}
}
