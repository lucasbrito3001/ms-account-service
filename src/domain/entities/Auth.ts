import { DomainBase } from "../Base";

export class Authentication extends DomainBase {
	private constructor(public readonly token: string) {
		super();
	}

	static create(
		accountId: string,
		firebaseId: string,
		email: string
	): Authentication {
		const token = this.createJWT({ accountId, firebaseId, email });

		return new Authentication(token);
	}
}
