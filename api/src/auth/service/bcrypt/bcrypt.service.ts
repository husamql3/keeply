import { Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";

import { env } from "@/config/env";

@Injectable()
export class BcryptService {
	private readonly saltRounds = Number(env.BCRYPT_SALT_ROUNDS);

	public async hash(plain: string): Promise<string> {
		return bcrypt.hash(plain, this.saltRounds);
	}

	public async compare(plain: string, hashed: string): Promise<boolean> {
		return bcrypt.compare(plain, hashed);
	}
}
