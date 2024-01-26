import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity("account")
export class AccountEntity {
	@PrimaryColumn("uuid")
	id?: string;
}
