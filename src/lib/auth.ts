import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "@/db";
import { env } from "@/env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
		twitter: {
			clientId: env.TWITTER_CLIENT_ID,
			clientSecret: env.TWITTER_CLIENT_SECRET,
		},
	},
	plugins: [
		tanstackStartCookies(),
		emailOTP({
			async sendVerificationOTP({ email, otp }: { email: string; otp: string }) {
				// TODO: send OTP email to `email`
				console.log(`OTP for ${email}: ${otp}`);
			},
		}),
	],
});
