import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class MagicLinkDto {
	@ApiProperty({ example: "jane@example.com" })
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
