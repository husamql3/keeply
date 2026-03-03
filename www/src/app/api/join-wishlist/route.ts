import path from "path";

import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { transporter } from "@/lib/email";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as { email: string };
		const { email } = body;

		if (!email || typeof email !== "string") {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
		}

		const { error } = await supabase.from("keeply_wishlist").insert({ email });
		if (error) {
			if (error.code === "23505") {
				return NextResponse.json({ error: "This email is already on the waitlist!" }, { status: 409 });
			}
			return NextResponse.json({ error: error.message }, { status: 500 });
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

		revalidatePath("/api/wishlist");

		return NextResponse.json(
			{
				message: "Successfully joined the waitlist!",
				email,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error processing waitlist signup:", error);
		return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
	}
}
