import { randomBytes, createHash } from "crypto";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { env } from "@/config/env";
import { RefreshToken } from "@/entity/refresh-token.entity";

@Injectable()
export class RefreshTokenService {
	constructor(
		@InjectRepository(RefreshToken)
		private readonly refreshTokenRepo: Repository<RefreshToken>,
	) {}

	async create(userId: string): Promise<string> {
		const plainToken = this.generateTokenString();
		const tokenHash = this.hashToken(plainToken);
		const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRATION);

		await this.refreshTokenRepo.save({
			tokenHash,
			userId,
			expiresAt,
			revoked: false,
		});

		return plainToken;
	}

	async validate(token: string): Promise<{ record: RefreshToken; newToken: string }> {
		const tokenHash = this.hashToken(token);

		// Find valid, non-expired token and mark it as used in one operation
		const record = await this.refreshTokenRepo.findOne({
			where: {
				tokenHash,
				revoked: false,
			},
		});

		if (!record) {
			throw new UnauthorizedException("Refresh token not found");
		}

		if (record.expiresAt < new Date()) {
			// Revoke expired token to prevent reuse
			await this.revokeByHash(tokenHash);
			throw new UnauthorizedException("Refresh token expired");
		}

		// Revoke current token and issue a new one to prevent reuse
		await this.revokeByHash(tokenHash);
		const newPlainToken = await this.create(record.userId);

		return { record, newToken: newPlainToken };
	}

	generateTokenString(): string {
		return randomBytes(32).toString("hex");
	}

	hashToken(token: string): string {
		return createHash("sha256").update(token).digest("hex");
	}

	async find(token: string): Promise<RefreshToken | null> {
		const tokenHash = this.hashToken(token);
		return this.refreshTokenRepo.findOne({ where: { tokenHash } });
	}

	async revoke(token: string): Promise<void> {
		const tokenHash = this.hashToken(token);
		await this.revokeByHash(tokenHash);
	}

	private async revokeByHash(tokenHash: string): Promise<void> {
		await this.refreshTokenRepo.update({ tokenHash }, { revoked: true });
	}

	async revokeAll(userId: string): Promise<void> {
		await this.refreshTokenRepo.update({ userId }, { revoked: true });
	}

	// Delete expired refresh tokens - used in a cron job
	async deleteExpired(): Promise<void> {
		await this.refreshTokenRepo.createQueryBuilder().delete().where("expiresAt < :now", { now: new Date() }).execute();
	}
}
