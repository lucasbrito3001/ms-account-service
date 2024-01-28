import { FirebaseAuthRepository } from "@/application/repository/FirebaseAuthRepository";
import {
	ResetPassword,
	ResetPasswordPort,
} from "@/application/usecase/ResetPassword";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { FirebaseAuthMemoryRepository } from "@/infra/repository/mock/FirebaseAuthMemoryRepository";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("[Use Case - Reset Password]", () => {
	let registry = new DependencyRegistry();

	let firebaseAuthRepository: FirebaseAuthRepository;

	let resetPassword: ResetPasswordPort;

	beforeEach(() => {
		firebaseAuthRepository = new FirebaseAuthMemoryRepository();
		registry.push("firebaseAuthRepository", firebaseAuthRepository);

		resetPassword = new ResetPassword(registry);
	});

	test("should return a message saying that the user will receive an email to reset the password", async () => {
		const spyResetPassword = vi.spyOn(firebaseAuthRepository, "resetPassword");
		const email = "mock@mail.com";

		const result = await resetPassword.execute(email);

		expect(spyResetPassword).toHaveBeenCalledOnce();
		expect(spyResetPassword).toHaveBeenCalledWith(email);
		expect(result).toBeUndefined();
	});
});
