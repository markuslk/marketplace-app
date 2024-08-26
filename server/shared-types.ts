import { insertBidSchema, insertItemSchema, selectItemSchema } from "./db/schema/schema";
import { z } from "zod";

export type SelectItem = z.infer<typeof selectItemSchema>;

export const createItemSchema = insertItemSchema.omit({
	userId: true,
	createdAt: true,
	id: true,
	isPublished: true,
});

export type CreateItem = z.infer<typeof createItemSchema>;

export const createBidSchema = insertBidSchema.omit({
	userId: true,
	id: true,
	createdAt: true,
	itemId: true,
});

export type CreateBid = z.infer<typeof createBidSchema>;
