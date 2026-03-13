import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class MagicLinkDto {
	@ApiProperty({ example: "jane@example.com" })
	@IsEmail()
	@IsNotEmpty()
	email: string;
}

export class MagicLinkVerifyDto {
	@ApiProperty({ example: "token" })
	@IsString()
	@IsNotEmpty()
	token: string;
}
