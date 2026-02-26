import nodemailer from "nodemailer";

if (!process.env.EMAIL_PASSWORD) {
	throw new Error("Missing email environment variables");
}

export const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "team@keeply.cc",
		pass: process.env.EMAIL_PASSWORD,
	},
	pool: true,
	maxConnections: 5,
	maxMessages: Number.POSITIVE_INFINITY,
	rateLimit: 10,
	rateDelta: 1000,
});
