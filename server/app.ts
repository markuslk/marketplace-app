import { Hono } from "hono";
import { itemsRoute } from "./routes/items";
import { AuthRoutes } from "./routes/auth";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";

const app = new Hono();

// app.use("*", logger());

// app.use(csrf());

const apiRoutes = app.basePath("/api").route("/", AuthRoutes).route("/items", itemsRoute);

export default app;

export type ApiRoutes = typeof apiRoutes;
