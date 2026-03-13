import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
	@ApiProperty({ example: "a1b2c3..." })
	@IsString()
	@IsNotEmpty()
	refresh_token: string;
}
