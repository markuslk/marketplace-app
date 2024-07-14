import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
	createdAt: timestamp("created_at").defaultNow(),
});
