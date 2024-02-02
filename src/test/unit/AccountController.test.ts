import { AccountController } from "@/application/controller/AccountController";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { GeneralLogger } from "@/infra/log/GeneralLogger";
import { describe, expect, test, vi } from "vitest";
import {
	MockRegisterInput,
	MockResetPasswordInput,
	MockSignInInput,
} from "../constants";
import { Request, Response } from "express";
import { RegisterInputSchema } from "@/application/controller/dto/RegisterInput";
import {
	InvalidRegisterInputError,
	InvalidResetPasswordInputError,
} from "@/error/AccountError";
import { RegisterOutput } from "@/application/usecase/Register";
import { ZodSchemaValidator } from "@/infra/ZodSchemaValidator";
import { SchemaValidatorError } from "@/application/controller/schema/SchemaValidator";
import { ResetPasswordInputSchema } from "@/application/controller/dto/ResetPasswordInput";
import { SignInInputSchema } from "@/application/controller/dto/SignInInput";
import { InvalidSignInInputError } from "@/error/AuthError";

describe("[Controller - Account]", () => {
	const mockReq = {} as Request;
	const mockRes = {
		status: vi.fn().mockImplementation(() => ({ json: vi.fn() })),
	} as any as Response;
	const mockNext = vi.fn().mockImplementation((value) => value);
	const registerInputSchemaValidator = new ZodSchemaValidator(
		RegisterInputSchema
	);
	const resetPasswordInputSchemaValidator = new ZodSchemaValidator(
		ResetPasswordInputSchema
	);
	const signInInputSchemaValidator = new ZodSchemaValidator(SignInInputSchema);

	const mockRegisterOutput = new RegisterOutput("0");

	let registry = new DependencyRegistry()
		.push(
			"resetPasswordInputSchemaValidator",
			resetPasswordInputSchemaValidator
		)
		.push("registerInputSchemaValidator", registerInputSchemaValidator)
		.push("signInInputSchemaValidator", signInInputSchemaValidator)
		.push("register", { execute: () => mockRegisterOutput })
		.push("logger", new GeneralLogger());

	let accountController = new AccountController(registry);

	describe("[Method - Register]", () => {
		test("should throw InvalidRegisterInputError when pass invalid req.body", async () => {
			const input = new MockRegisterInput();
			input.email = "";

			const req = { body: input } as Request;

			const result = await accountController.registerEntrypoint(
				req,
				mockRes,
				mockNext
			);

			expect(result).toBeInstanceOf(InvalidRegisterInputError);
			expect(result.cause[0]).toBeInstanceOf(SchemaValidatorError);
		});

		test("should register a new Account successfully", async () => {
			const input = new MockRegisterInput();

			const req = { body: input } as Request;

			const result = await accountController.registerEntrypoint(
				req,
				mockRes,
				mockNext
			);

			expect(result).toStrictEqual(mockRegisterOutput);
		});
	});

	describe("[Method - Reset Password]", () => {
		test("should throw InvalidResetPasswordInputError when pass invalid req.body", async () => {
			const input = new MockResetPasswordInput();

			const req = { body: {} } as Request;

			const result = await accountController.resetPasswordEntrypoint(
				req,
				mockRes,
				mockNext
			);

			expect(result).toBeInstanceOf(InvalidResetPasswordInputError);
			expect(result.cause[0]).toBeInstanceOf(SchemaValidatorError);
		});

		test("should send a reset password request successfully", async () => {
			const input = new MockResetPasswordInput();

			const req = { body: input } as Request;

			const fn = () =>
				accountController.resetPasswordEntrypoint(req, mockRes, mockNext);

			expect(fn).not.toThrow();
		});
	});
});
