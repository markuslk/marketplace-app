import { Hono } from "hono";
import { db } from "../db";
import { lucia } from "../lib/auth";
import { generateId } from "lucia";
import { hash } from "@node-rs/argon2";

import type { Context } from "../lib/context";
import { usersTable } from "../db/schema/schema";

export const signupRoute = new Hono<Context>();

signupRoute.post("/", async (c) => {
	const body = await c.req.parseBody<{ username: string; password: string; email: string }>();

	const username: string | null = body.username ?? "null";
	if (!username || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
		return console.log("error with username");
	}

	const email: string | null = body.email ?? "hello@gmail.com";

	const password: string | null = body.password ?? "null123456";
	if (!password || password.length < 6 || password.length > 125) {
		return console.log("error with password");
	}

	const passwordHash = await hash(password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	const userId = generateId(15);

	try {
		await db
			.insert(usersTable)
			.values({ id: userId, username, email, passwordHash })
			.onConflictDoNothing()
			.returning({ userId: usersTable.id, username: usersTable.username, email: usersTable.email });
		const session = await lucia.createSession(userId, {});
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
		console.log("user created!");
		return c.redirect("/");
	} catch (err) {
		return console.log("error when creating user");
	}
});
