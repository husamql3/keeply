import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "@/auth/controller/auth/auth.controller";
import { AuthService } from "@/auth/service/auth/auth.service";
import { RefreshTokenService } from "@/auth/service/refresh-token/refresh-token.service";
import { EmailService } from "@/common/service/email/email.service";
import { MagicLinkToken } from "@/entity/magic-link-token.entity";
import { RefreshToken } from "@/entity/refresh-token.entity";
import { UserModule } from "@/user/user.module";

import { MagicLinkController } from "./controller/magic-link/magic-link.controller";
import { BcryptService } from "./service/bcrypt/bcrypt.service";
import { MagicLinkService } from "./service/magic-link/magic-link.service";

@Module({
	imports: [TypeOrmModule.forFeature([RefreshToken, MagicLinkToken]), JwtModule.register({}), UserModule],
	controllers: [AuthController, MagicLinkController],
	providers: [AuthService, RefreshTokenService, MagicLinkService, EmailService, BcryptService],
	exports: [AuthService, MagicLinkService, EmailService, BcryptService],
})
export class AuthModule {}
