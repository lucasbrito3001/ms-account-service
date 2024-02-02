import { Address } from "@/domain/entities/Address";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AddressEntity } from "./Address.entity";

@Entity("account")
export class AccountEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column({ type: "varchar" })
	firstName?: string;
	@Column({ type: "varchar" })
	lastName?: string;
	@Column({ type: "varchar" })
	email?: string;
	@Column({ type: "varchar" })
	cpf?: string;
	@Column({ type: "varchar" })
	createdAt?: string;
	@Column({ type: "varchar" })
	firebaseId?: string;
	@OneToMany(() => AddressEntity, (address) => address.account)
	addresses?: AddressEntity[];
}
