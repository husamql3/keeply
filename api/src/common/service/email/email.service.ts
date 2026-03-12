import { env } from '@/config/env';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';


@Injectable()
export class EmailService {
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
    try {
      await this.transporter.sendMail({
        from: `"Keeply" <${env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
