import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { LoginDto } from "@/auth/dto/login.dto";
import { RefreshTokenDto } from "@/auth/dto/refresh-token.dto";
import { RegisterDto } from "@/auth/dto/register.dto";
import { AuthService } from "@/auth/service/auth/auth.service";
import { RefreshTokenService } from "@/auth/service/refresh-token/refresh-token.service";
import { JwtSign } from "@/auth/types/auth.type";
import { UserService } from "@/user/service/user/user.service";

const jwtSignSchema = {
	type: "object",
	properties: {
		access_token: { type: "string", example: "eyJhbGci..." },
		refresh_token: { type: "string", example: "a1b2c3..." },
	},
};

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly refreshTokenService: RefreshTokenService,
	) {}

	@HttpCode(201)
	@Post("register")
	@ApiOperation({ summary: "Register a new user" })
	@ApiBody({ type: RegisterDto })
	@ApiResponse({ status: 201, description: "User created; returns token pair", schema: jwtSignSchema })
	@ApiResponse({ status: 400, description: "Validation error" })
	@ApiResponse({ status: 409, description: "Email already in use" })
	async register(@Body() dto: RegisterDto): Promise<JwtSign> {
		const user = await this.userService.create(dto);
		return this.authService.signToken({ sub: user.id, name: user.name, role: user.role });
	}

	@HttpCode(200)
	@Post("login")
	@ApiOperation({ summary: "Login with email and password" })
	@ApiBody({ type: LoginDto })
	@ApiResponse({ status: 200, description: "Returns token pair", schema: jwtSignSchema })
	@ApiResponse({ status: 400, description: "Validation error" })
	@ApiResponse({ status: 401, description: "Invalid credentials" })
	async login(@Body() dto: LoginDto): Promise<JwtSign> {
		const user = await this.authService.validateUser(dto.email, dto.password);
		return this.authService.signToken({ sub: user.id, name: user.name, role: user.role });
	}

	@HttpCode(200)
	@Post("refresh")
	@ApiOperation({ summary: "Exchange a refresh token for a new token pair" })
	@ApiBody({ type: RefreshTokenDto })
	@ApiResponse({ status: 200, description: "Returns a new token pair", schema: jwtSignSchema })
	@ApiResponse({ status: 401, description: "Refresh token invalid or expired" })
	async refresh(@Body() dto: RefreshTokenDto): Promise<JwtSign> {
		return this.authService.refresh(dto.refresh_token);
	}

	@HttpCode(204)
	@Post("logout")
	@ApiOperation({ summary: "Revoke a refresh token" })
	@ApiBody({ type: RefreshTokenDto })
	@ApiResponse({ status: 204, description: "Token revoked" })
	@ApiResponse({ status: 401, description: "Refresh token not found" })
	async logout(@Body() dto: RefreshTokenDto): Promise<void> {
		await this.refreshTokenService.revoke(dto.refresh_token);
	}
}
