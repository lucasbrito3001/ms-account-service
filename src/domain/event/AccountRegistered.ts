export class AccountRegistered {
	constructor(
		readonly accountId: string,
		readonly firstName: string,
		readonly lastName: string,
		readonly email: string
	) {}
}
