import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { GeneralLogger } from "@/infra/log/GeneralLogger";
import { describe, expect, test, vi } from "vitest";
import { MockResetPasswordInput, MockSignInInput } from "../constants";
import { Request, Response } from "express";
import { RegisterInputSchema } from "@/application/controller/dto/RegisterInput";
import { RegisterOutput } from "@/application/usecase/Register";
import { ZodSchemaValidator } from "@/infra/ZodSchemaValidator";
import { SchemaValidatorError } from "@/application/controller/schema/SchemaValidator";
import { ResetPasswordInputSchema } from "@/application/controller/dto/ResetPasswordInput";
import { SignInInputSchema } from "@/application/controller/dto/SignInInput";
import { InvalidSignInInputError } from "@/error/AuthError";
import { AuthController } from "@/application/controller/AuthController";
import { SignIn, SignInOutput } from "@/application/usecase/SignIn";

describe("[Controller - Account]", () => {
	const mockReq = {} as Request;
	const mockRes = {
		status: vi.fn().mockImplementation(() => ({ json: vi.fn() })),
	} as any as Response;
	const mockNext = vi.fn().mockImplementation((value) => value);
	const signInInputSchemaValidator = new ZodSchemaValidator(SignInInputSchema);

	const mockSignInOutput = new SignInOutput("0");

	let registry = new DependencyRegistry()
		.push("signInInputSchemaValidator", signInInputSchemaValidator)
		.push("logger", new GeneralLogger())
		.push("signIn", { execute: () => mockSignInOutput });

	let authController = new AuthController(registry);

	describe("[Method - Sign In]", () => {
		test("should throw InvalidSignInInputError when pass invalid req.body", async () => {
			const req = { body: {} } as Request;

			const result = await authController.signInEntrypoint(
				req,
				mockRes,
				mockNext
			);

			expect(result).toBeInstanceOf(InvalidSignInInputError);
			expect(result.cause[0]).toBeInstanceOf(SchemaValidatorError);
		});

		test("should return the signIn output successfully", async () => {
			const input = new MockSignInInput();
			const req = { body: input } as Request;

			const result = await authController.signInEntrypoint(
				req,
				mockRes,
				mockNext
			);

			expect(result).toBe(mockSignInOutput);
		});
	});
});
