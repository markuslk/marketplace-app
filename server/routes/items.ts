import { Hono } from "hono";
import { db } from "../db";
import { itemsTable } from "../db/schema/schema";
import type { Context } from "../lib/context";

export const itemsRoute = new Hono<Context>()
	.get("/", async (c) => {
		const items = await db.select().from(itemsTable);

		return c.json({ items });
	})
	.post("/", async (c) => {
		// const user = c.get("user");
		// if (!user) {
		// 	console.log("redirected");
		// 	return c.redirect("/login");
		// }

		const result = await db
			.insert(itemsTable)
			.values({ id: "1", userId: "5", title: "some title" })
			.returning()
			.then((res) => res[0]);

		c.status(201);
		console.log(result);
		return c.json(result);
	});
