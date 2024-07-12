import { Hono } from "hono";
import { db } from "../db";
import { items as itemsTable } from "../db/schema/items";

export const itemsRoute = new Hono().get("/", async (c) => {
	const items = await db.select().from(itemsTable);

	return c.json({ items });
});
