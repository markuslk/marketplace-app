import { boolean, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").unique().notNull(),
	username: text("username").unique().notNull(),
	passwordHash: text("password_hash").notNull(),
});

export const sessionsTable = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const itemsTable = pgTable("items", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => usersTable.id),
	title: text("title").notNull(),
	description: text("description").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	isPublished: boolean("is_published"),
	startingPrice: numeric("starting_price", { precision: 12, scale: 2 }).notNull(),
	currentOfferPrice: numeric("current_price", { precision: 12, scale: 2 }),
	buyNowPrice: numeric("buy_price", { precision: 12, scale: 2 }).notNull(),
});

export const insertItemSchema = createInsertSchema(itemsTable, {
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	description: z.string().min(60, { message: "Description must be at least 60 characters" }),
	isPublished: z.boolean().default(false),
	startingPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be a valid monetary value" }),
	currentOfferPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be a valid monetary value" }),
	buyNowPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be a valid monetary value" }),
});

export const selectItemSchema = createSelectSchema(itemsTable);
