import { AccountRepository } from "@/application/repository/AccountRepository";
import { Account } from "@/domain/entities/Account";

export class AccountMemoryRepository implements AccountRepository {
	private accounts: Account[] = [];

	async save(account: Account): Promise<void> {
		this.accounts.push(account);
	}

	async findByEmail(email: string): Promise<Account | null> {
		return this.accounts.find((account) => account.email === email) || null;
	}
}
