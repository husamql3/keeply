import { env } from "@/env";
import { transporter } from "@/lib/email/transporter";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
	return transporter.sendMail({
		from: env.EMAIL_USER,
		to,
		subject,
		html,
	});
}
