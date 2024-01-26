import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Logger } from "@/infra/log/Logger";
import { NextFunction, Request, Response } from "express";
import {
	RegisterAccountInput,
	RegisterAccountInputSchema,
} from "./dto/RegisterAccountInput";
import { RegisterAccount } from "../usecase/RegisterAccount";
import { ZodSchema } from "zod";
import { InvalidRegisterAccountInputError } from "@/error/AccountError";

export class AccountController {
	private readonly logger: Logger;
	private readonly registerAccount: RegisterAccount;
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
			const input: RegisterAccountInput = req.body;

			this.logger.logUseCase(
				"RegisterAccount",
				`Email: ${input.email} / Name: ${input.firstName} ${input.lastName}`
			);

			const schemaValidation = this.registerAccountInputSchema.safeParse(input);

			if (!schemaValidation.success)
				throw new InvalidRegisterAccountInputError(schemaValidation.error);

			const output = await this.registerAccount.execute(input);

			res.status(201).json(output);

			return output;
		} catch (error) {
			return next(error);
		}
	};
}
