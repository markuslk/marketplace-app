import { Hono } from "hono";
import { itemsRoute } from "./routes/items";
import { AuthRoutes } from "./routes/auth";
import { bidsForItemRoute } from "./routes/bids";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";

const app = new Hono();

// app.use("*", logger());

// app.use(csrf());

const apiRoutes = app
	.basePath("/api")
	.route("/", AuthRoutes)
	.route("/items", itemsRoute)
	.route("/items/:id{[0-9]+}/bids", bidsForItemRoute);

export default app;

export type ApiRoutes = typeof apiRoutes;
