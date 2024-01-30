import { ErrorBase } from "./ErrorBase";

export class InvalidCPFError extends ErrorBase {
	constructor() {
		super("INVALID_CPF", "Unable to create account, CPF is invalid.", 400);
	}
}

export class MismatchedPasswordsError extends ErrorBase {
	constructor() {
		super(
			"MISMATCHED_PASSWORD",
			"The passwords do not match. Please check and try again",
			400
		);
	}
}

export class DuplicatedEmailError extends ErrorBase {
	constructor() {
		super(
			"DUPLICATED_EMAIL",
			"The email address is already in use. Please change and try again",
			400
		);
	}
}

export class InvalidRegisterInputError extends ErrorBase {
	constructor(cause: any) {
		super("INVALID_INPUT", "The input is invalid", 400, cause);
	}
}

export class EmailNotFoundError extends ErrorBase {
	constructor() {
		super("EMAIL_NOT_FOUND", "Email not found in the database", 400);
	}
}
