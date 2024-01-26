import { OrderController } from "@/application/controller/OrderController";
import { DependencyRegistry } from "../DependencyRegistry";
import { Router } from "express";

export class OrderRouter {
	private orderController: OrderController;

	constructor(private router: Router, readonly registry: DependencyRegistry) {
		this.orderController = new OrderController(registry);
	}

	expose() {
		this.router.post(
			"/register_order",
			this.orderController.register
		);
		this.router.get("/list_orders", this.orderController.list);
	}
}
