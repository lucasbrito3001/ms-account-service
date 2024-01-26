import { AccountController } from "@/application/controller/AccountController";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { GeneralLogger } from "@/infra/log/GeneralLogger";
import { describe, expect, test, vi } from "vitest";
import { MockRegisterAccountInput } from "../constants";
import { Request, Response } from "express";
import { RegisterAccountInputSchema } from "@/application/controller/dto/RegisterAccountInput";
import { InvalidRegisterAccountInputError } from "@/error/AccountError";
import { ZodError } from "zod";
import { RegisterAccountOutput } from "@/application/usecase/interfaces/RegisterAccountPort";

describe("[Controller - Account]", () => {
	const mockReq = {} as Request;
	const mockRes = {
		status: vi.fn().mockImplementation(() => ({ json: vi.fn() })),
	} as any as Response;
	const mockNext = vi.fn().mockImplementation((value) => value);
	const registerAccountInputSchema = RegisterAccountInputSchema;
	const mockRegisterAccountOutput = new RegisterAccountOutput("0");

	let registry = new DependencyRegistry()
		.push("registerAccountInputSchema", registerAccountInputSchema)
		.push("registerAccount", { execute: () => mockRegisterAccountOutput })
		.push("logger", new GeneralLogger());

	let accountController = new AccountController(registry);

	describe("[Method - Register]", async () => {
		test("should throw InvalidRegisterAccountInputError when pass invalid req.body", async () => {
			const input = new MockRegisterAccountInput();
			input.email = "";

			const req = { body: input } as Request;

			const result = await accountController.register(req, mockRes, mockNext);

			expect(result).toBeInstanceOf(InvalidRegisterAccountInputError);
			expect(result.cause).toBeInstanceOf(ZodError);
		});

		test("should register a new Account successfully", async () => {
			const input = new MockRegisterAccountInput();

			const req = { body: input } as Request;

			const result = await accountController.register(req, mockRes, mockNext);

			expect(result).toStrictEqual(mockRegisterAccountOutput);
		});
	});
});
