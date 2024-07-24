import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { itemsTable } from "../db/schema/schema";
import type { Context } from "../lib/context";

export const itemsRoute = new Hono<Context>()

	.get("/", async (c) => {
		const items = await db
			.select()
			.from(itemsTable)
			.where(eq(itemsTable.isPublished, true))
			.orderBy(desc(itemsTable.createdAt))
			.limit(40);
		return c.json(items);
	})

	.get("/:id{[0-9]+}", async (c) => {
		const { id } = c.req.param();
		const item = await db
			.select()
			.from(itemsTable)
			.where(and(eq(itemsTable.isPublished, true), eq(itemsTable.id, id)))
			.then((res) => res[0]);

		if (!item) {
			return c.notFound();
		}
		return c.json({ item });
	});
// .post("/", async (c) => {
// 	// const user = c.get("user");
// 	// if (!user) {
// 	// 	console.log("redirected");
// 	// 	return c.redirect("/login");
// 	// }

// 	const result = await db
// 		.insert(itemsTable)
// 		.values({ })
// 		.returning()
// 		.then((res) => res[0]);

// 	c.status(201);
// 	console.log(result);
// 	return c.json(result);
// });
