import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { BcryptService } from "@/auth/service/bcrypt/bcrypt.service";
import { RefreshTokenService } from "@/auth/service/refresh-token/refresh-token.service";
import { JwtSign, Payload } from "@/auth/types/auth.type";
import { env } from "@/config/env";
import { UserService } from "@/user/service/user/user.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly refreshTokenService: RefreshTokenService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly bcryptService: BcryptService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const isMatch = await this.bcryptService.compare(password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException("Invalid credentials");
		}

		return user;
	}

	async signToken(payload: Payload): Promise<JwtSign> {
		const accessToken = this.jwtService.sign(payload, {
			secret: env.JWT_SECRET,
			expiresIn: env.JWT_EXPIRATION,
		});
		const refreshToken = await this.refreshTokenService.create(payload.sub);

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
		};
	}

	async refresh(token: string): Promise<JwtSign> {
		const { userId, newToken } = await this.refreshTokenService.validate(token);

		const user = await this.userService.findUserById(userId);
		if (!user) {
			throw new UnauthorizedException("User not found");
		}

		const accessToken = this.jwtService.sign(
			{ sub: user.id, name: user.name, role: user.role },
			{ secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRATION },
		);

		return {
			access_token: accessToken,
			refresh_token: newToken,
		};
	}
}
