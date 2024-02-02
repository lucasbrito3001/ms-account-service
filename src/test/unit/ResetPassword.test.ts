import { AuthManager } from "@/application/repository/AuthManager";
import {
	ResetPassword,
	ResetPasswordPort,
} from "@/application/usecase/ResetPassword";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { FirebaseAuthMemoryRepository } from "@/infra/repository/mock/FirebaseAuthMemoryRepository";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("[Use Case - Reset Password]", () => {
	let registry = new DependencyRegistry();

	let authManager: AuthManager;

	let resetPassword: ResetPasswordPort;

	beforeEach(() => {
		authManager = new FirebaseAuthMemoryRepository();
		registry.push("authManager", authManager);

		resetPassword = new ResetPassword(registry);
	});

	test("should return a message saying that the user will receive an email to reset the password", async () => {
		const spyResetPassword = vi.spyOn(authManager, "sendPasswordResetEmail");
		const email = "mock@mail.com";

		const result = await resetPassword.execute(email);

		expect(spyResetPassword).toHaveBeenCalledOnce();
		expect(spyResetPassword).toHaveBeenCalledWith(email);
		expect(result).toBeUndefined();
	});
});
