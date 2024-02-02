import { RegisterInput } from "@/application/controller/dto/RegisterInput";
import { DomainBase } from "../Base";
import { Address } from "./Address";
import { InvalidCPFError } from "@/error/AccountError";
import { AccountEntity } from "@/infra/repository/entity/Account.entity";

export class Account extends DomainBase {
	private constructor(
		public readonly id: string,
		public email: string,
		public firstName: string,
		public lastName: string,
		public cpf: string,
		public addresses: Address[],
		public readonly createdAt: string,
		public firebaseId: string
	) {
		super();
	}

	static create = (input: RegisterInput, firebaseId: string): Account => {
		const id = this.createRandomUUID();
		const createdAt = new Date().toISOString();

		const cpf = input.cpf.replace(/\D/g, "");
		const isValidCpf = this.cpfValidator(cpf);

		if (!isValidCpf) throw new InvalidCPFError();

		return new Account(
			id,
			input.email,
			input.firstName,
			input.lastName,
			cpf,
			[],
			createdAt,
			firebaseId
		);
	};

	static instance = (
		accountEntity: AccountEntity,
	): Account => {
		return new Account(
			accountEntity.id as string,
			accountEntity.email as string,
			accountEntity.firstName as string,
			accountEntity.lastName as string,
			accountEntity.cpf as string,
			accountEntity.addresses as Address[],
			accountEntity.createdAt as string,
			accountEntity.firebaseId as string
		);
	};
}
