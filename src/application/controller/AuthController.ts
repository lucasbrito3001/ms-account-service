import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Logger } from "@/infra/log/Logger";
import { NextFunction, Request, Response } from "express";
import { SchemaValidator } from "./schema/SchemaValidator";
import { SignInPort } from "../usecase/SignIn";
import { SignInInput } from "./dto/SignInInput";
import { InvalidSignInInputError } from "@/error/AuthError";

export class AuthController {
	private readonly logger: Logger;
	private readonly signIn: SignInPort;
	private readonly signInInputSchemaValidator: SchemaValidator;

	constructor(registry: DependencyRegistry) {
		this.logger = registry.inject("logger");
		this.signIn = registry.inject("signIn");
		this.signInInputSchemaValidator = registry.inject(
			"signInInputSchemaValidator"
		);
	}

	signInEntrypoint = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const input: SignInInput = req.body;

			this.logger.logUseCase("SignIn", `Email: ${input.email}`);

			const schemaValidation =
				this.signInInputSchemaValidator.validate<SignInInput>(input);

			if (!schemaValidation.isValid)
				throw new InvalidSignInInputError(schemaValidation.errors);

			const output = await this.signIn.execute(input.email, input.password);

			res.status(200).json(output);

			return output;
		} catch (error) {
			return next(error);
		}
	};
}
