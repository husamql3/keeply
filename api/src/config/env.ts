import path from "path";

import { config } from "dotenv";
import { z } from "zod";

config({
	path:
		process.env.NODE_ENV === "development"
			? path.join(process.cwd(), ".env.development")
			: path.join(process.cwd(), ".env.production"),
});

export const env = z
	.object({
		PORT: z.coerce.number().default(4000),
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

		// Production uses DATABASE_URL, dev uses individual vars
		DATABASE_URL: z.string().optional(),
		DB_HOST: z.string().default("localhost"),
		DB_PORT: z.coerce.number().default(5432),
		DB_USERNAME: z.string().default("postgres"),
		DB_PASSWORD: z.string().default("postgres"),
		DB_NAME: z.string().default("keeply"),

		// Email
		EMAIL_USER: z.string(),
		EMAIL_PASSWORD: z.string(),

		// JWT
		JWT_SECRET: z.string(),
		JWT_EXPIRATION: z.coerce.number(),
		REFRESH_TOKEN_SECRET: z.string(),
		REFRESH_TOKEN_EXPIRATION: z.coerce.number(),

		// Bcrypt
		BCRYPT_SALT_ROUNDS: z.coerce.number(),
	})
	.parse(process.env);
