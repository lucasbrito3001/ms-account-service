import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { AccountEntity } from "./Account.entity";

@Entity("address")
export class AddressEntity {
	@PrimaryColumn("uuid")
	id?: string;
	@Column({ type: "varchar" })
	street?: string;
	@Column({ type: "varchar" })
	district?: string;
	@Column({ type: "integer" })
	number?: string;
	@Column({ type: "varchar" })
	city?: string;
	@Column({ type: "varchar" })
	country?: string;
	@Column({ type: "varchar" })
	state?: string;
	@Column({ type: "varchar" })
	complement?: string;
	@ManyToOne(() => AccountEntity, (accountEntity) => accountEntity.addresses)
	account?: AccountEntity;
}
