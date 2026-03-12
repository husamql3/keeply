import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "@/auth/controller/auth/auth.controller";
import { AuthService } from "@/auth/service/auth/auth.service";
import { RefreshTokenService } from "@/auth/service/refresh-token/refresh-token.service";
import { RefreshToken } from "@/entity/refresh-token.entity";
import { UserModule } from "@/user/user.module";
import { MagicLinkService } from './service/magic-link/magic-link.service';

@Module({
	imports: [TypeOrmModule.forFeature([RefreshToken]), JwtModule.register({}), UserModule],
	controllers: [AuthController],
	providers: [AuthService, RefreshTokenService, MagicLinkService],
	exports: [AuthService],
})
export class AuthModule {}
