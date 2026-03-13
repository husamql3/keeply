import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { MagicLinkDto } from "@/auth/dto/magic-link.dto";
import { MagicLinkService } from "@/auth/service/magic-link/magic-link.service";
import { JwtSign } from "@/auth/types/auth.type";

const jwtSignSchema = {
	type: "object",
	properties: {
		access_token: { type: "string", example: "eyJhbGci..." },
		refresh_token: { type: "string", example: "a1b2c3..." },
	},
};

@Controller("magic-link")
@ApiTags("auth")
export class MagicLinkController {
	constructor(private readonly magicLinkService: MagicLinkService) {}

	@HttpCode(200)
	@Post()
	@ApiOperation({ summary: "Send a magic link to the user" })
	@ApiBody({ type: MagicLinkDto })
	@ApiResponse({ status: 200, description: "Magic link sent" })
	@ApiResponse({ status: 400, description: "Validation error" })
	async magicLink(@Body() dto: MagicLinkDto) {
		await this.magicLinkService.create(dto.email);
	}

	@Get("verify")
	@ApiOperation({ summary: "Verify a magic link token and return JWT tokens" })
	@ApiQuery({ name: "token", description: "The magic link token", type: String })
	@ApiResponse({ status: 200, description: "Returns token pair", schema: jwtSignSchema })
	@ApiResponse({ status: 400, description: "Invalid or expired token" })
	async verify(@Query("token") token: string): Promise<JwtSign> {
		return await this.magicLinkService.verify(token);
	}
}
