import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Logger } from "@/infra/log/Logger";
import { NextFunction, Request, Response } from "express";
import { RegisterInput } from "./dto/RegisterInput";
import { RegisterPort } from "../usecase/Register";
import {
	InvalidRegisterInputError,
	InvalidResetPasswordInputError,
} from "@/error/AccountError";
import { SchemaValidator } from "./schema/SchemaValidator";
import { ResetPasswordInput } from "./dto/ResetPasswordInput";
import { ResetPasswordPort } from "../usecase/ResetPassword";

export class AccountController {
	private readonly logger: Logger;
	private readonly register: RegisterPort;
	private readonly resetPassword: ResetPasswordPort;
	private readonly registerInputSchemaValidator: SchemaValidator;
	private readonly resetPasswordInputSchemaValidator: SchemaValidator;

	constructor(registry: DependencyRegistry) {
		this.logger = registry.inject("logger");
		this.register = registry.inject("register");
		this.resetPassword = registry.inject("resetPassword");
		this.registerInputSchemaValidator = registry.inject(
			"registerInputSchemaValidator"
		);
		this.resetPasswordInputSchemaValidator = registry.inject(
			"resetPasswordInputSchemaValidator"
		);
	}

	registerEntrypoint = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const input: RegisterInput = req.body;

			this.logger.logUseCase(
				"Register",
				`Email: ${input.email} / Name: ${input.firstName} ${input.lastName}`
			);

			const schemaValidation =
				this.registerInputSchemaValidator.validate<RegisterInput>(input);

			if (!schemaValidation.isValid)
				throw new InvalidRegisterInputError(schemaValidation.errors);

			const output = await this.register.execute(schemaValidation.data);

			res.status(201).json(output);

			return output;
		} catch (error) {
			return next(error);
		}
	};

	resetPasswordEntrypoint = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const input: ResetPasswordInput = req.body;

			this.logger.logUseCase("ResetPassword", `Email: ${input.email}`);

			const schemaValidation =
				this.resetPasswordInputSchemaValidator.validate<ResetPasswordInput>(
					input
				);

			if (!schemaValidation.isValid)
				throw new InvalidResetPasswordInputError(schemaValidation.errors);

			await this.resetPassword.execute(schemaValidation.data.email);

			res.status(200).json({ email: input.email });

			return;
		} catch (error) {
			return next(error);
		}
	};
}
