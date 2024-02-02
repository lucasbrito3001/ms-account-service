import { AccountRepository } from "@/application/repository/AccountRepository";
import { Account } from "@/domain/entities/Account";
import { Repository } from "typeorm";
import { AccountEntity } from "./entity/Account.entity";

export class AccountDatabaseRepository implements AccountRepository {
	constructor(private readonly accountRepository: Repository<AccountEntity>) {}

	async save(account: Account): Promise<void> {
		await this.accountRepository.save(account);
	}

	async findByEmail(email: string): Promise<Account | null> {
		const accountEntity = await this.accountRepository.findOneBy({ email });

		if (accountEntity === null) return null;

		return Account.instance(accountEntity);
	}
}
