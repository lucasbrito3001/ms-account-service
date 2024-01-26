import { RegisterAccountInput } from "@/application/controller/dto/RegisterAccountInput";
import { DomainBase } from "../Base";
import { randomUUID } from "node:crypto";
import { hashSync } from "bcrypt";
import { Address } from "./Address";
import { InvalidCPFError } from "@/error/AccountError";

export class Account extends DomainBase {
	private constructor(
		public id: string,
		public email: string,
		public passwordHash: string,
		public firstName: string,
		public lastName: string,
		public cpf: string,
		public addresses: Address[],
		public createdAt: string,
		public firebaseId: string
	) {
		super();
	}

	static create = (
		input: RegisterAccountInput,
		firebaseId: string
	): Account => {
		const id = randomUUID();
		const createdAt = new Date().toISOString();
		const passwordHash = hashSync(
			input.password,
			process.env.SALT_ROUNDS ? +process.env.SALT_ROUNDS : 10
		);

		const cpf = input.cpf.replace(/\D/g, "");
		const isValidCpf = this.cpfValidator(cpf);

		if (!isValidCpf) throw new InvalidCPFError();

		return new Account(
			id,
			input.email,
			passwordHash,
			input.firstName,
			input.lastName,
			input.cpf,
			[],
			createdAt,
			firebaseId
		);
	};
}
