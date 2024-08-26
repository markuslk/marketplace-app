import { Hono } from "hono";
import type { Context } from "../lib/context";
import { getUser } from "../middleware";
import { zValidator } from "@hono/zod-validator";
import { createBidSchema } from "../shared-types";
import { bidsTable, insertBidSchema, itemsTable } from "../db/schema/schema";
import { db } from "../db";
import { desc, eq } from "drizzle-orm";

export const bidsForItemRoute = new Hono<Context>()

	.get("/", async (c) => {
		const itemId = c.req.param("id");

		const bids = await db
			.select()
			.from(bidsTable)
			.where(eq(bidsTable.itemId, Number(itemId)))
			.orderBy(desc(bidsTable.createdAt))
			.limit(40);

		return c.json(bids);
	})

	.post("/", getUser, zValidator("json", createBidSchema), async (c) => {
		const bid = await c.req.valid("json");
		const user = c.var.user;
		const itemId = c.req.param("id");

		if (!user) {
			throw new Error("No user found");
		}

		if (!itemId) {
			throw new Error("No item found");
		}

		const validatedBid = insertBidSchema.parse({
			...bid,
			userId: user.id,
			itemId: Number(itemId),
		});

		const result = await db
			.insert(bidsTable)
			.values(validatedBid)
			.returning()
			.then((res) => res[0]);

		await db
			.update(itemsTable)
			.set({ currentOfferPrice: validatedBid.bidAmount })
			.where(eq(itemsTable.id, Number(itemId)));

		c.status(201);
		return c.json(result);
	});
