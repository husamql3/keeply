import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { Elysia, file } from "elysia";

import { env } from "@/env";
import { auth, OpenAPI } from "@/lib/auth";
import { logger } from "@/middlewares/logger";
import { collectionRoute } from "@/routes/collection";

export default new Elysia({ prefix: "/api" })
	.use(logger)
	.get("/favicon.ico", () => file("public/favicon.ico"))
	.use(
		openapi({
			documentation: {
				info: {
					title: "keeply-server",
					version: "1.0.0",
				},
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
			swagger: {
				theme: "kepler",
			},
		}),
	)
	.use(
		cors({
			origin: env.BASE_URL,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.mount("/auth", auth.handler)
	.use(collectionRoute)
	.get("/", () => "OK")
	.listen(3000);
