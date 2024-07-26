import { Hono } from "hono";
import { db } from "../db";
import { isValidEmail, lucia } from "../lib/auth";
import { generateId } from "lucia";
import { hash } from "@node-rs/argon2";
import { verify } from "@node-rs/argon2";
import type { Context } from "../lib/context";
import { sessionsTable, usersTable } from "../db/schema/schema";
import { TUserCredentialsValidator } from "../../frontend/src/lib/validators/user-credentials-validator";
import { and, eq } from "drizzle-orm";
import { getUser } from "../middleware";

export const AuthRoutes = new Hono<Context>()
	.get("/user", getUser, async (c) => {
		const user = c.var.user;
		return c.json({ user });
	})
	.delete("/logout", getUser, async (c) => {
		const { user, session } = c.var;
		if (!user || !session) {
			return console.log("no user or session");
		}
		await lucia.invalidateSession(session.id);
		await db
			.delete(sessionsTable)
			.where(and(eq(sessionsTable.id, session.id), eq(sessionsTable.userId, user.id)))
			.returning()
			.then((res) => res[0]);
		return c.json({ message: "Logged out" });
	})
	.post("/signup", async (c) => {
		const body = await c.req.json<{ username: string; password: string; email: string }>();
		console.log(body);

		const username: string | null = body.username ?? null;
		if (!username || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
			return console.log("error with username");
		}

		const email: string | null = body.email ?? null;
		if (!email) {
			return console.log("error with email");
		}
		const password: string | null = body.password ?? null;
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

		await db
			.insert(usersTable)
			.values({ id: userId, username, email, passwordHash })
			.onConflictDoNothing()
			.returning({ userId: usersTable.id, email: usersTable.email })
			.then((res) => res[0]);
		const session = await lucia.createSession(userId, {});
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
		return c.json({ message: "Signed up" });
	})
	.post("/login", async (c) => {
		const body = await c.req.json<TUserCredentialsValidator>();

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
			return new Response("Invalid password", {
				status: 400,
			});
		}

		const session = await lucia.createSession(user.id, {});
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
		return c.json({ message: "Logged in" });
	});
