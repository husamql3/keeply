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

	async validate(token: string): Promise<{ userId: string; newToken: string }> {
		const tokenHash = this.hashToken(token);
		const now = new Date();

		// Atomically revoke the token only if it's valid and non-expired.
		// If two concurrent requests race with the same token, only one UPDATE
		// will match (affected === 1); the other gets affected === 0 → 401.
		const result = await this.refreshTokenRepo
			.createQueryBuilder()
			.update(RefreshToken)
			.set({ revoked: true })
			.where('"tokenHash" = :tokenHash AND revoked = false AND "expiresAt" > :now', { tokenHash, now })
			.returning('"userId"')
			.execute();

		if (!result.affected || result.affected === 0) {
			throw new UnauthorizedException("Refresh token invalid or expired");
		}

		const userId: string = result.raw[0].userId;
		const newToken = await this.create(userId);

		return { userId, newToken };
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
		await this.refreshTokenRepo
			.createQueryBuilder()
			.delete()
			.where('"expiresAt" < :now', { now: new Date() })
			.execute();
	}

	private generateTokenString(): string {
		return randomBytes(32).toString("hex");
	}
}
