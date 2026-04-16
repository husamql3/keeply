import nodemailer from "nodemailer";

import { env } from "@/env";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASSWORD,
	},
});
