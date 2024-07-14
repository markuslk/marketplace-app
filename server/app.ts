import { Hono } from "hono";
import { itemsRoute } from "./routes/items";
import { signupRoute } from "./routes/signup";

const app = new Hono();

const apiRoutes = app.basePath("/api").route("/items", itemsRoute).route("/signup", signupRoute);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;

export type ApiRoutes = typeof apiRoutes;
