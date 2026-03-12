import { EmailService } from '@/common/service/email/email.service';
import { MagicLinkToken } from '@/entity/magic-link-token.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptService } from '@/auth/service/bcrypt/bcrypt.service';
import { env } from '@/config/env';

@Injectable()
export class MagicLinkService {
  constructor(
    @InjectRepository(MagicLinkToken)
    private readonly magicLinkTokenRepo: Repository<MagicLinkToken>,
    private readonly emailService: EmailService,
    private readonly bcryptService: BcryptService,
  ) { }

  async create(email: string): Promise<void> {
    const token = this.bcryptService.generateToken();
    const tokenHash = await this.bcryptService.hash(token);

    const expiresAt = new Date(Date.now() + env.MAGIC_LINK_EXPIRATION * 60 * 1000);

    const magicLinkToken = this.magicLinkTokenRepo.create({
      email,
      tokenHash,
      expiresAt,
    });

    await this.magicLinkTokenRepo.save(magicLinkToken);

    await this.emailService.sendEmail(email, 'Magic Link', `Click <a href="${env.FRONTEND_URL}/magic-link?token=${token}">here</a> to login`);
  }

  async verify(token: string) {
    const tokenHash = this.bcryptService.generateTokenHash(token);
    const magicLinkToken = await this.magicLinkTokenRepo.findOne({ where: { tokenHash } });
    if (!magicLinkToken || magicLinkToken.used || magicLinkToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    await this.magicLinkTokenRepo.update(magicLinkToken.id, { used: true });
  }

  async useToken(token: string): Promise<void> {
    const magicLinkToken = await this.magicLinkTokenRepo.findOne({ where: { tokenHash: token } });
    if (!magicLinkToken) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.magicLinkTokenRepo.update(magicLinkToken.id, { used: true });
  }
}
