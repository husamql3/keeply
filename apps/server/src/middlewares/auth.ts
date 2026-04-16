import { Elysia } from "elysia";

import { auth } from "@/lib/auth";

export const authMiddleware = new Elysia({ name: "auth-middleware" }).derive({ as: "scoped" }, async ({ request }) => {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		return { session };
	} catch {
		return { session: null };
	}
});
