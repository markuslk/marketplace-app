import { Hono } from "hono";
import { db } from "../db";
import { isValidEmail, lucia } from "../lib/auth";
import { generateId } from "lucia";
import { hash } from "@node-rs/argon2";
import { verify } from "@node-rs/argon2";
import type { Context } from "../lib/context";
import { usersTable } from "../db/schema/schema";
import { TUserCredentialsValidator } from "../../frontend/src/lib/validators/user-credentials-validator";
import { eq } from "drizzle-orm";

export const AuthRoutes = new Hono<Context>();

AuthRoutes.post("/signup", async (c) => {
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
		return console.log(err);
	}
});

AuthRoutes.post("/signin", async (c) => {
	const body = await c.req.parseBody<TUserCredentialsValidator>();

	const email = body.email;
	if (!email || isValidEmail(email) === false) {
		return new Response("error with email", {
			status: 400,
		});
	}

	const password = body.password;
	if (!password || typeof password !== "string") {
		return new Response("error with password", {
			status: 400,
		});
	}

	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.limit(1)
		.then((res) => res[0]);

	if (!user) {
		return new Response("invalid email or password", {
			status: 400,
		});
	}

	const validPassword = await verify(user.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	if (!validPassword) {
		return new Response("Invalid email or password", {
			status: 400,
		});
	}

	const session = await lucia.createSession(user.id, {});
	c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
	console.log("user logged in");
	return c.redirect("/");
});
