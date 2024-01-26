import express, { Express, NextFunction, Request, Response } from "express";
import { DataSourceConnection } from "./DataSource";
import { Server } from "http";
import { CONFIG_ROUTERS } from "./router";
import { QueueController } from "./queue/QueueController";
import { UncaughtExceptionHandler } from "@/error/UncaughtExceptionHandler";
import { Logger } from "./log/Logger";
import { Queue } from "./queue/Queue";
import cors from "cors";
import {
	DatabaseConnectionError,
	QueueConnectionError,
} from "@/error/InfraError";
import { QueueSubscriber } from "./queue/subscriber/QueueSubscriber";
import { DependencyRegistry } from "./DependencyRegistry";

export class WebServer {
	private server: Server | undefined;
	private app: Express = express();

	constructor(
		private dataSourceConnection: DataSourceConnection,
		private queue: Queue,
		private logger: Logger
	) {}

	start = async (isTest: boolean) => {
		this.app.use(express.json());
		this.app.use(cors());

		try {
			await this.dataSourceConnection.initialize();
		} catch (error) {
			throw new DatabaseConnectionError(error as any);
		}

		try {
			await this.queue.connect();
		} catch (error) {
			throw new QueueConnectionError(error as any);
		}

		const registry = await this.fillRegistry();

		this.setRoutes(registry);
		this.setQueueControllerSubscribers(registry);

		// Exception handler middleware
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction): void => {
				return new UncaughtExceptionHandler(res, this.logger).handle(err);
			}
		);

		if (isTest) return this.app;

		this.server = this.app.listen(process.env.PORT, () => {
			this.logger.log(
				`\n[SERVER] Server started, listening on port: ${process.env.PORT}\n`
			);
		});
	};

	private async fillRegistry() {
		const registry = new DependencyRegistry();

		registry.push("queue", this.queue).push("logger", this.logger);

		return registry;
	}

	private setQueueControllerSubscribers = (registry: DependencyRegistry) => {
		const subs: QueueSubscriber[] = [];

		new QueueController(registry).appendSubscribers(subs);
	};

	private setRoutes = (registry: DependencyRegistry) => {
		CONFIG_ROUTERS.forEach((config_router) => {
			const router = express.Router();
			new config_router(router, registry).expose();
			this.app.use("/", router);
		});

		this.app.get("/healthy", (_, res) => {
			res.send("Hello world!");
		});
	};

	gracefulShutdown = () => {
		if (!this.server) return;
		this.server.close();
	};
}
