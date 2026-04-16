import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { z } from "zod";

config();

export const env = createEnv({
	server: {
		// node environment
		NODE_ENV: z.enum(["development", "production"]),

		// database
		DATABASE_URL: z.string(),

		// better-auth
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.url(),
		BETTER_AUTH_API_KEY: z.string().min(1),

		// google
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),

		// github
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),

		// twitter
		TWITTER_CLIENT_ID: z.string().min(1),
		TWITTER_CLIENT_SECRET: z.string().min(1),

		// email
		EMAIL_USER: z.email(),
		EMAIL_PASSWORD: z.string().min(1),

		// supabase
		SUPABASE_URL: z.url(),
		SUPABASE_ANON_KEY: z.string().min(1),

		// URL
		BASE_URL: z.url(),

		// // sentry
		// SENTRY_ORG: z.string().optional(),
		// SENTRY_PROJECT: z.string().optional(),
		// SENTRY_AUTH_TOKEN: z.string().optional(),
	},
	runtimeEnv: process.env,
});
