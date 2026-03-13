import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";

import { env } from "@/config/env";

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);
	private readonly transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			secure: false,
			auth: {
				user: env.SMTP_USER,
				pass: env.SMTP_PASS,
			},
			pool: true,
			maxConnections: 5,
			maxMessages: Number.POSITIVE_INFINITY,
			rateLimit: 10,
			rateDelta: 1000,
		});
	}

	async sendEmail(to: string, subject: string, html: string): Promise<void> {
		this.logger.log(`Sending email to: ${to}, subject: ${subject}`);
		try {
			await this.transporter.sendMail({
				from: `"Keeply" <${env.SMTP_USER}>`,
				to,
				subject,
				html,
			});
			this.logger.log(`Email sent successfully to: ${to}`);
		} catch (error) {
			this.logger.error(`Failed to send email to: ${to}`, error);
			throw new InternalServerErrorException("Failed to send email");
		}
	}
}
