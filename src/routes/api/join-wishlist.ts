import fs from "fs/promises";
import path from "node:path";

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { transporter } from "@/lib/email/transporter";
import { supabase } from "@/lib/supabase";

const joinWishlistSchema = z.object({
	email: z.email(),
});

export const Route = createFileRoute("/api/join-wishlist")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = await request.json();
				const result = joinWishlistSchema.safeParse(body);

				if (!result.success) {
					return Response.json({ error: "Invalid email address." }, { status: 400 });
				}

				const { email } = result.data;

				const { error } = await supabase.from("keeply_wishlist").insert({ email });
				if (error) {
					if (error.code === "23505") {
						return Response.json({ error: "This email is already on the waitlist!" }, { status: 409 });
					}
					return Response.json({ error: error.message }, { status: 500 });
				}

				const templatePath = path.join(process.cwd(), "public", "waitlist-joined-template.html");
				const emailTemplate = await fs.readFile(templatePath, "utf-8");
				await transporter.sendMail({
					from: `"Keeply" <no-reply@keeply.cc>`,
					to: email,
					subject: "Welcome to Keeply! 🎉",
					html: emailTemplate,
					replyTo: undefined,
				});

				return Response.json(
					{
						message: "Successfully joined the waitlist!",
						email,
					},
					{ status: 200 },
				);
			},
		},
	},
});
