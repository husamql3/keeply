import { randomBytes, createHash } from "crypto";

import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { env } from "@/config/env";
import { RefreshToken } from "@/entity/refresh-token.entity";

@Injectable()
export class RefreshTokenService {
	private readonly logger = new Logger(RefreshTokenService.name);

	constructor(
		@InjectRepository(RefreshToken)
		private readonly refreshTokenRepo: Repository<RefreshToken>,
	) { }

	async create(userId: string): Promise<string> {
		this.logger.log(`Creating refresh token for user: ${userId}`);

		const plainToken = this.generateTokenString();
		const tokenHash = this.hashToken(plainToken);
		const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRATION);

		await this.refreshTokenRepo.save({
			tokenHash,
			userId,
			expiresAt,
			revoked: false,
		});

		this.logger.log(`Refresh token created for user: ${userId}`);
		return plainToken;
	}

	async validate(token: string): Promise<{ userId: string; newToken: string }> {
		this.logger.log("Validating refresh token");

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
			this.logger.warn("Refresh token validation failed: invalid or expired token");
			throw new UnauthorizedException("Refresh token invalid or expired");
		}

		const userId: string = result.raw[0].userId;
		this.logger.log(`Refresh token validated for user: ${userId}`);

		const newToken = await this.create(userId);

		return { userId, newToken };
	}

	hashToken(token: string): string {
		return createHash("sha256").update(token).digest("hex");
	}

	async find(token: string): Promise<RefreshToken | null> {
		this.logger.debug("Finding refresh token");
		const tokenHash = this.hashToken(token);
		const found = await this.refreshTokenRepo.findOne({ where: { tokenHash } });
		if (found) {
			this.logger.debug(`Refresh token found for user: ${found.userId}`);
		} else {
			this.logger.debug("Refresh token not found");
		}
		return found;
	}

	async revoke(token: string): Promise<void> {
		this.logger.log("Revoking refresh token");
		const tokenHash = this.hashToken(token);
		await this.revokeByHash(tokenHash);
	}

	private async revokeByHash(tokenHash: string): Promise<void> {
		this.logger.debug(`Revoking token by hash: ${tokenHash.substring(0, 8)}...`);
		await this.refreshTokenRepo.update({ tokenHash }, { revoked: true });
		this.logger.debug("Token revoked successfully");
	}

	async revokeAll(userId: string): Promise<void> {
		this.logger.log(`Revoking all refresh tokens for user: ${userId}`);
		await this.refreshTokenRepo.update({ userId }, { revoked: true });
		this.logger.log(`All refresh tokens revoked for user: ${userId}`);
	}

	// Delete expired refresh tokens - used in a cron job
	async deleteExpired(): Promise<void> {
		this.logger.log("Deleting expired refresh tokens");
		const result = await this.refreshTokenRepo
			.createQueryBuilder()
			.delete()
			.where('"expiresAt" < :now', { now: new Date() })
			.execute();
		this.logger.log(`Deleted ${result.affected || 0} expired refresh tokens`);
	}

	private generateTokenString(): string {
		return randomBytes(32).toString("hex");
	}
}
