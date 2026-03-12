import { Injectable } from "@nestjs/common";
import { createHash, randomBytes } from "crypto";
import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";

import { env } from "@/config/env";

@Injectable()
export class BcryptService {
	private readonly saltRounds = Number(env.BCRYPT_SALT_ROUNDS);

	public hash(plain: string) {
		return bcryptHash(plain, this.saltRounds);
	}

	public compare(plain: string, hashed: string) {
		return bcryptCompare(plain, hashed);
	}

	public generateToken(): string {
		return randomBytes(32).toString('hex');
	}

	public generateTokenHash(token: string) {
		return createHash('sha256').update(token).digest('hex');
	}
}
