import { HttpStatusCode } from "axios";
import { ErrorBase } from "./ErrorBase";

export class BadCredentialsError extends ErrorBase {
	constructor() {
		super(
			"BAD_CREDENTIALS",
			"Invalid email and/or password",
			HttpStatusCode.Unauthorized
		);
	}
}

export class InvalidSignInInputError extends ErrorBase {
	constructor(cause: any) {
		super(
			"INVALID_INPUT",
			"The input is invalid",
			HttpStatusCode.BadRequest,
			cause
		);
	}
}
