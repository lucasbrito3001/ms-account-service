import "reflect-metadata";
import "module-alias/register";

import { config } from "dotenv";
import { DataSourceConnection } from "./infra/DataSource";
import { WebServer } from "./infra/Server";
import { RabbitMQAdapter } from "./infra/queue/RabbitMQAdapter";
import { GeneralLogger } from "./infra/log/GeneralLogger";

config();

const logger = new GeneralLogger();

const dataSourceConnection = new DataSourceConnection();
const queueAdapter = new RabbitMQAdapter(logger);

const webServer = new WebServer(dataSourceConnection, queueAdapter, logger);

["uncaughtException", "SIGINT", "SIGTERM"].forEach((signal) =>
	process.on(signal, (err) => {
		console.log(`[${signal.toUpperCase()}]: ${err}`);
		webServer.gracefulShutdown();
		process.exit(1);
	})
);

webServer.start(false);
