import { AccountController } from "@/application/controller/AccountController";
import { DependencyRegistry } from "../DependencyRegistry";
import { Router } from "express";

export class AccountRouter {
	private accountController: AccountController;

	constructor(private router: Router, readonly registry: DependencyRegistry) {
		this.accountController = new AccountController(registry);
	}

	expose() {
		this.router.post(
			"/register_account",
			this.accountController.registerEntrypoint
		);
		this.router.post(
			"/reset_password",
			this.accountController.resetPasswordEntrypoint
		);
	}
}
