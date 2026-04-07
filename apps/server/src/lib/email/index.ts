import { env } from "@/env";
import { transporter } from "@/lib/email/transporter";
import { SendEmailProps } from "@/types/email.types";

export async function sendEmail({ to, subject, html }: SendEmailProps) {
	return transporter.sendMail({
		from: env.EMAIL_USER,
		to,
		subject,
		html,
	});
}
