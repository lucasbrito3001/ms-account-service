import { DependencyRegistry } from "../DependencyRegistry";
import { Router } from "express";
import { AuthController } from "@/application/controller/AuthController";

export class AuthRouter {
	private authController: AuthController;

	constructor(private router: Router, readonly registry: DependencyRegistry) {
		this.authController = new AuthController(registry);
	}

	expose() {
		this.router.post("/sign_in", this.authController.signInEntrypoint);
	}
}
