import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { insertItemSchema, itemsTable } from "../db/schema/schema";
import type { Context } from "../lib/context";
import { getUser } from "../middleware";
import { zValidator } from "@hono/zod-validator";
import { createItemSchema } from "../shared-types";

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
		const id = c.req.param("id");
		const item = await db
			.select()
			.from(itemsTable)
			.where(and(eq(itemsTable.isPublished, true), eq(itemsTable.id, Number(id))))
			.then((res) => res[0]);

		if (!item) {
			return c.notFound();
		}
		return c.json({ item });
	})

	.post("/", getUser, zValidator("json", createItemSchema), async (c) => {
		const item = await c.req.valid("json");
		const user = c.var.user;

		if (!user) {
			throw new Error("No user found");
		}

		const validatedItem = insertItemSchema.parse({
			...item,
			userId: user.id,
		});

		const result = await db
			.insert(itemsTable)
			.values(validatedItem)
			.returning()
			.then((res) => res[0]);

		c.status(201);
		return c.json(result);
	});
