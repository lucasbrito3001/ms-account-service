import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { beforeEach, describe, expect, test } from "vitest";
import { MockRegisterInput, MockSignInInput } from "../constants";
import { AuthManagerAndDatabaseInconsistencyError } from "@/error/AccountError";
import { AccountRepository } from "@/application/repository/AccountRepository";
import { AccountMemoryRepository } from "@/infra/repository/mock/AccountMemoryRepository";
import { Account } from "@/domain/entities/Account";
import { AuthManager } from "@/application/repository/AuthManager";
import { FirebaseAuthMemoryRepository } from "@/infra/repository/mock/FirebaseAuthMemoryRepository";
import { Queue } from "@/infra/queue/Queue";
import { MockQueue } from "@/infra/queue/mock/MockQueue";
import { SignIn, SignInOutput } from "@/application/usecase/SignIn";
import { BadCredentialsError } from "@/error/AuthError";

describe("[Use Case - Sign In]", () => {
	let registry = new DependencyRegistry();

	let accountRepository: AccountRepository;
	let authManager: AuthManager;
	let queue: Queue;

	let signIn: SignIn;

	beforeEach(() => {
		accountRepository = new AccountMemoryRepository();
		authManager = new FirebaseAuthMemoryRepository();
		queue = new MockQueue();

		registry
			.push("accountRepository", accountRepository)
			.push("authManager", authManager)
			.push("queue", queue);

		signIn = new SignIn(registry);
	});

	test("should throw BadCredentialsError when pass incorrect email or password", () => {
		const input = new MockSignInInput();

		const fn = () => signIn.execute(input.email, input.password);

		expect(fn).rejects.toBeInstanceOf(BadCredentialsError);
	});

	test("should throw AuthManagerAndDatabaseInconsistencyError when signIn in firebase and dont found the account in the db", () => {
		const input = new MockSignInInput();
		authManager.createUser(input.email, input.password);

		const fn = () => signIn.execute(input.email, input.password);

		expect(fn).rejects.toBeInstanceOf(AuthManagerAndDatabaseInconsistencyError);
	});

	test("should signIn successfully", async () => {
		const input = new MockSignInInput();
		const inputAcc = new MockRegisterInput();

		authManager.createUser(input.email, input.password);
		accountRepository.save(Account.create(inputAcc, "0"));

		const account = await signIn.execute(input.email, input.password);

		expect(account).toBeInstanceOf(SignInOutput);
	});
});
