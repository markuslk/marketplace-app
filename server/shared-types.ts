import { insertItemSchema, selectItemSchema } from "./db/schema/schema";
import { z } from "zod";

export type SelectItem = z.infer<typeof selectItemSchema>;

export const createItemSchema = insertItemSchema.omit({
	userId: true,
	createdAt: true,
	id: true,
});

export type CreateItem = z.infer<typeof createItemSchema>;
