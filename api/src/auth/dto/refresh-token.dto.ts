import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
	@ApiProperty({ example: "a1b2c3..." })
	@IsString()
	refresh_token: string;
}
