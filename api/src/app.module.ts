import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { AuthModule } from "@/auth/auth.module";
import { dbConfig } from "@/config/db";
import { UserModule } from "@/user/user.module";

import { EmailService } from "./common/service/email/email.service";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => dbConfig as TypeOrmModuleOptions,
		}),
		AuthModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService, EmailService],
})
export class AppModule {}
