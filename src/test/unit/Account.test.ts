import { Account } from "@/domain/entities/Account";
import { describe, expect, test } from "vitest";
import { MockRegisterInput } from "../constants";
import { InvalidCPFError } from "@/error/AccountError";

describe("[Domain - Account]", () => {
	test("should throw InvalidCPFError when pass invalid cpf", () => {
		const invalidCpf = "589.523.213-11";

		const inputAccount = JSON.parse(JSON.stringify(new MockRegisterInput()));
		inputAccount.cpf = invalidCpf;

		const fn = () => Account.create(inputAccount, "firebaseid");

		expect(fn).toThrow(InvalidCPFError);
	});

	test("should create a new Account instance with hashPassword and id", () => {
		const account = Account.create(new MockRegisterInput(), "firebaseid");

		expect(account.passwordHash).toBeDefined();
		expect(account.id).toBeDefined();
	});
});
