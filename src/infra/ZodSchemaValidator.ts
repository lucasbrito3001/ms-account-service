import {
	SchemaValidator,
	SchemaValidatorError,
	SchemaValidationOutputError,
	SchemaValidationOutputSuccess,
	ValidateReturnType,
} from "@/application/controller/schema/SchemaValidator";
import { ZodSchema } from "zod";

export class ZodSchemaValidator implements SchemaValidator {
	constructor(private readonly schema: ZodSchema) {}

	validate<Input>(input: Input): ValidateReturnType<Input> {
		const validationResult = this.schema.safeParse(input);

		if (!validationResult.success) {
			const errors = validationResult.error.issues.map(
				({ code, message, path }) =>
					new SchemaValidatorError(code, message, path[0])
			);

			return new SchemaValidationOutputError(errors);
		}

		return new SchemaValidationOutputSuccess(validationResult.data);
	}
}
