import { ZodIssueCode } from "zod";

export class SchemaValidatorError {
	constructor(
		readonly code: ZodIssueCode,
		readonly message: string,
		readonly property: string | number
	) {}
}

export class SchemaValidationOutputSuccess<Data> {
	public readonly isValid = true;

	constructor(public readonly data: Data) {}
}

export class SchemaValidationOutputError {
	public readonly isValid = false;

	constructor(public readonly errors: SchemaValidatorError[]) {}
}

export declare type ValidateReturnType<Input> =
	| SchemaValidationOutputSuccess<Input>
	| SchemaValidationOutputError;

export interface SchemaValidator {
	validate<Input>(input: Input): ValidateReturnType<Input>;
}
