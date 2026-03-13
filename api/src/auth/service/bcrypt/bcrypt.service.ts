import { createHash, randomBytes } from "crypto";

import { Injectable, Logger } from "@nestjs/common";
import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";

import { env } from "@/config/env";

@Injectable()
export class BcryptService {
	private readonly logger = new Logger(BcryptService.name);
	private readonly saltRounds = Number(env.BCRYPT_SALT_ROUNDS);

	public hash(plain: string): Promise<string> {
		this.logger.debug("Hashing plain text");
		return bcryptHash(plain, this.saltRounds);
	}

	public compare(plain: string, hashed: string): Promise<boolean> {
		this.logger.debug("Comparing plain text with hash");
		return bcryptCompare(plain, hashed);
	}

	public generateToken(): string {
		this.logger.debug("Generating random token");
		return randomBytes(32).toString("hex");
	}

	public generateTokenHash(token: string): string {
		this.logger.debug("Generating token hash");
		return createHash("sha256").update(token).digest("hex");
	}
}
