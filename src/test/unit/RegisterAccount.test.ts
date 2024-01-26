import { RegisterAccount } from "@/application/usecase/RegisterAccount";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { beforeEach, describe, expect, test } from "vitest";
import { MockRegisterAccountInput } from "../constants";
import {
	DuplicatedEmailError,
	MismatchedPasswordsError,
} from "@/error/AccountError";
import { AccountRepository } from "@/application/repository/AccountRepository";
import { AccountMemoryRepository } from "@/infra/repository/mock/AccountMemoryRepository";
import { Account } from "@/domain/entities/Account";
import { RegisterAccountOutput } from "@/application/usecase/interfaces/RegisterAccountPort";
import { FirebaseAuthRepository } from "@/application/repository/FirebaseAuthRepository";
import { FirebaseAuthMemoryRepository } from "@/infra/repository/mock/FirebaseAuthMemoryRepository";

describe("[Use Case - Register Account]", () => {
	let registry = new DependencyRegistry();

	let accountRepository: AccountRepository;
	let firebaseAuthRepository: FirebaseAuthRepository;

	let registerAccount: RegisterAccount;

	beforeEach(() => {
		accountRepository = new AccountMemoryRepository();
		firebaseAuthRepository = new FirebaseAuthMemoryRepository();

		registry.push("accountRepository", accountRepository);
		registry.push("firebaseAuthRepository", firebaseAuthRepository);

		registerAccount = new RegisterAccount(registry);
	});

	test("should throw MismatchedPasswordsError when the fields password and confirmPassword don't match", () => {
		const input = new MockRegisterAccountInput();
		input.confirmPassword = "differentPassword";

		const fn = () => registerAccount.execute(input);

		expect(fn).rejects.toBeInstanceOf(MismatchedPasswordsError);
	});

	test("should return DuplicatedEmailError when try to register a new account with an already registered email", async () => {
		await accountRepository.save(
			Account.create(new MockRegisterAccountInput(), "firebaseid")
		);

		const input = new MockRegisterAccountInput();

		const fn = () => registerAccount.execute(input);

		expect(fn).rejects.toBeInstanceOf(DuplicatedEmailError);
	});

	test("should register a new account successfully", async () => {
		const input = new MockRegisterAccountInput();

		const account = await registerAccount.execute(input);
		
		expect(account).toBeInstanceOf(RegisterAccountOutput);
	});
});
