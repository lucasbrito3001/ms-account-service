import { DependencyRegistry } from "@/infra/DependencyRegistry";
import {
	RegisterAccountOutput,
	RegisterAccountPort,
} from "./interfaces/RegisterAccountPort";
import { RegisterAccountInput } from "../controller/dto/RegisterAccountInput";
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

export class RegisterAccount implements RegisterAccountPort {
	private readonly firebaseAuthRepository: FirebaseAuthRepository;
	private readonly accountRepository: AccountRepository;

	constructor(registry: DependencyRegistry) {
		this.firebaseAuthRepository = registry.inject("firebaseAuthRepository");
		this.accountRepository = registry.inject("accountRepository");
	}

	async execute(input: RegisterAccountInput): Promise<RegisterAccountOutput> {
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

		return new RegisterAccountOutput(account.id);
	}
}
