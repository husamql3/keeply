import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AuthService } from "@/auth/service/auth/auth.service";
import { BcryptService } from "@/auth/service/bcrypt/bcrypt.service";
import { JwtSign } from "@/auth/types/auth.type";
import { EmailService } from "@/common/service/email/email.service";
import { env } from "@/config/env";
import { MagicLinkToken } from "@/entity/magic-link-token.entity";
import { UserService } from "@/user/service/user/user.service";

@Injectable()
export class MagicLinkService {
	private readonly logger = new Logger(MagicLinkService.name);

	constructor(
		@InjectRepository(MagicLinkToken)
		private readonly magicLinkTokenRepo: Repository<MagicLinkToken>,
		private readonly emailService: EmailService,
		private readonly bcryptService: BcryptService,
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	async create(email: string): Promise<void> {
		const token = this.bcryptService.generateToken();
		const tokenHash = this.bcryptService.generateTokenHash(token);

		const expiresAt = new Date(Date.now() + env.MAGIC_LINK_EXPIRATION * 60 * 1000);
		this.logger.log(`Creating magic link token for ${email} with expiration ${expiresAt.toISOString()}`);

		const magicLinkToken = this.magicLinkTokenRepo.create({
			email,
			tokenHash,
			expiresAt,
		});

		await this.magicLinkTokenRepo.save(magicLinkToken);
		this.logger.log(`Sending magic link email to ${email}. Expires at: ${expiresAt.toISOString()}`);

		await this.emailService.sendEmail(
			email,
			"Magic Link",
			`Click <a href="${env.FRONTEND_URL}/magic-link?token=${token}">here</a> to login`,
		);
		this.logger.log(`Magic link email sent to ${email}. Expires at: ${expiresAt.toISOString()}`);
	}

	async verify(token: string): Promise<JwtSign> {
		const tokenHash = this.bcryptService.generateTokenHash(token);
		this.logger.log("Verifying magic link token");

		const magicLinkToken = await this.magicLinkTokenRepo.findOne({ where: { tokenHash, used: false } });
		if (!magicLinkToken || magicLinkToken.expiresAt < new Date()) {
			this.logger.error(
				`Invalid or expired token for ${tokenHash}. Expires at: ${magicLinkToken?.expiresAt?.toISOString()}`,
			);
			throw new UnauthorizedException("Invalid or expired token");
		}

		const { affected } = await this.magicLinkTokenRepo.update({ id: magicLinkToken.id, used: false }, { used: true });
		if (affected !== 1) {
			throw new UnauthorizedException("Invalid or expired token");
		}

		const user = await this.userService.findUserByEmail(magicLinkToken.email);
		if (!user) {
			this.logger.error(`User not found for ${magicLinkToken.email}`);
			throw new UnauthorizedException("User not found");
		}

		this.logger.log(`User ${user.id} verified magic link token for ${magicLinkToken.email}`);
		return this.authService.signToken({ sub: user.id, name: user.name ?? "", role: user.role });
	}
}
