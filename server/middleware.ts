import { lucia } from "./lib/auth";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { type User, type Session } from "lucia";

type Env = {
	Variables: {
		user: User | null;
		session: Session | null;
	};
};

export const getUser = createMiddleware<Env>(async (c, next) => {
	try {
		const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
		if (!sessionId) {
			c.set("user", null);
			c.set("session", null);
			console.log("no session id middleware");
			return next();
		}
		const { session, user } = await lucia.validateSession(sessionId);
		if (session && session.fresh) {
			c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
				append: true,
			});
			console.log("session and session fresh middleware");
		}
		if (!session) {
			c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
				append: true,
			});
			console.log("no session middleware");
		}
		c.set("user", user);
		c.set("session", session);
		await next();
	} catch (err) {
		return c.json({ error: "Unauthorized" }, 401);
	}
});
