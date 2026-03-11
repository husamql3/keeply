import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
	@ApiProperty({ example: "Jane Doe" })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: "jane@example.com" })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: "secret123", minLength: 8, maxLength: 32 })
	@IsString()
	@MinLength(8)
	@MaxLength(32)
	@IsNotEmpty()
	password: string;
}
