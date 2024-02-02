import { genSaltSync, hashSync } from "bcryptjs";
import { cpf } from "cpf-cnpj-validator";
import { sign } from "jsonwebtoken";
import { randomUUID } from "node:crypto";

export class DomainBase {
	static createRandomUUID(): string {
		return randomUUID();
	}

	static cpfValidator(document: string): boolean {
		return cpf.isValid(document);
	}

	static hashText(password: string): string {
		const saltValue = genSaltSync(parseInt(process.env.SALT_ROUNDS as string));
		const hash = hashSync(password, saltValue);
		return hash;
	}

	static createJWT(payload: any): string {
		return sign(
			payload,
			process.env.NODE_ENV == "unit"
				? "secret"
				: (process.env.JWT_SECRET as string),
			{
				algorithm: "HS256",
				expiresIn: "1h",
			}
		);
	}
}
