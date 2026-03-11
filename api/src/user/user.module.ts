import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BcryptService } from "@/auth/service/bcrypt/bcrypt.service";
import { User } from "@/entity/user.entity";
import { UserService } from "@/user/service/user/user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService, BcryptService],
	exports: [UserService, BcryptService],
})
export class UserModule {}
