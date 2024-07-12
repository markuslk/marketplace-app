import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(),
	title: text("title").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});
