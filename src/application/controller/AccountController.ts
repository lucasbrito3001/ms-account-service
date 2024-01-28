import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Logger } from "@/infra/log/Logger";
import { NextFunction, Request, Response } from "express";
import { RegisterInput } from "./dto/RegisterInput";
import { Register } from "../usecase/Register";
import { ZodSchema } from "zod";
import { InvalidRegisterInputError } from "@/error/AccountError";

export class AccountController {
	private readonly logger: Logger;
	private readonly registerAccount: Register;
	private readonly registerAccountInputSchema: ZodSchema;

	constructor(registry: DependencyRegistry) {
		this.logger = registry.inject("logger");
		this.registerAccount = registry.inject("registerAccount");
		this.registerAccountInputSchema = registry.inject(
			"registerAccountInputSchema"
		);
	}

	register = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const input: RegisterInput = req.body;

			this.logger.logUseCase(
				"RegisterAccount",
				`Email: ${input.email} / Name: ${input.firstName} ${input.lastName}`
			);

			const schemaValidation = this.registerAccountInputSchema.safeParse(input);

			if (!schemaValidation.success)
				throw new InvalidRegisterInputError(schemaValidation.error);

			const output = await this.registerAccount.execute(input);

			res.status(201).json(output);

			return output;
		} catch (error) {
			return next(error);
		}
	};
}
