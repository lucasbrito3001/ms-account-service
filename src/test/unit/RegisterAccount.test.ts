import { Register } from "@/application/usecase/Register";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { beforeEach, describe, expect, test } from "vitest";
import { MockRegisterInput } from "../constants";
import {
	DuplicatedEmailError,
	MismatchedPasswordsError,
} from "@/error/AccountError";
import { AccountRepository } from "@/application/repository/AccountRepository";
import { AccountMemoryRepository } from "@/infra/repository/mock/AccountMemoryRepository";
import { Account } from "@/domain/entities/Account";
import { RegisterOutput } from "@/application/usecase/Register";
import { AuthManager } from "@/application/repository/AuthManager";
import { FirebaseAuthMemoryRepository } from "@/infra/repository/mock/FirebaseAuthMemoryRepository";

describe("[Use Case - Register Account]", () => {
	let registry = new DependencyRegistry();

	let accountRepository: AccountRepository;
	let AuthManager: AuthManager;

	let registerAccount: Register;

	beforeEach(() => {
		accountRepository = new AccountMemoryRepository();
		AuthManager = new FirebaseAuthMemoryRepository();

		registry.push("accountRepository", accountRepository);
		registry.push("AuthManager", AuthManager);

		registerAccount = new Register(registry);
	});

	test("should throw MismatchedPasswordsError when the fields password and confirmPassword don't match", () => {
		const input = new MockRegisterInput();
		input.confirmPassword = "differentPassword";

		const fn = () => registerAccount.execute(input);

		expect(fn).rejects.toBeInstanceOf(MismatchedPasswordsError);
	});

	test("should return DuplicatedEmailError when try to register a new account with an already registered email", async () => {
		await accountRepository.save(
			Account.create(new MockRegisterInput(), "firebaseid")
		);

		const input = new MockRegisterInput();

		const fn = () => registerAccount.execute(input);

		expect(fn).rejects.toBeInstanceOf(DuplicatedEmailError);
	});

	test("should register a new account successfully", async () => {
		const input = new MockRegisterInput();

		const account = await registerAccount.execute(input);

		expect(account).toBeInstanceOf(RegisterOutput);
	});
});
