import { config } from "dotenv";
import { createEnv } from "@t3-oss/env-core";

config();
import { z } from "zod";

export const env = createEnv({
	server: {
		// node environment
		NODE_ENV: z.enum(["development", "production"]),

		// database
		DATABASE_URL: z.string(),

		// better-auth
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.url(),

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

		// sentry
		SENTRY_ORG: z.string().optional(),
		SENTRY_PROJECT: z.string().optional(),
		SENTRY_AUTH_TOKEN: z.string().optional(),
	},
	client: {
		VITE_SENTRY_DSN: z.string().optional(),
	},
	clientPrefix: "VITE_",
	runtimeEnv: process.env,
});
