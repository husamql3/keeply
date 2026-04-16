import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, openAPI } from "better-auth/plugins";

import { db } from "@/db";
import { env } from "@/env";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
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
		dash(),
		openAPI(),
		emailOTP({
			async sendVerificationOTP({ email, otp }: { email: string; otp: string }) {
				try {
					await sendEmail({
						to: email,
						subject: "Keeply - Verification Code",
						html: `Your verification code is: ${otp}`,
					});
				} catch (error) {
					console.error(error);
					throw new Error("Failed to send verification email.");
				}
			},
		}),
	],
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());
export const OpenAPI = {
	getPaths: (prefix = "/api/auth") =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);
			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				reference[key] = paths[path];
				for (const method of Object.keys(paths[path])) {
					const operation = (reference[key] as any)[method];
					operation.tags = ["Better Auth"];
				}
			}
			return reference;
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
