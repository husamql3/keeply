import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { dbConfig } from "@/config/db";

import { RefreshTokenService } from "./auth/service/refresh-token/refresh-token.service";
import { entities } from "./entity";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => dbConfig as TypeOrmModuleOptions,
		}),
		TypeOrmModule.forFeature(entities),
	],
	controllers: [AppController],
	providers: [AppService, RefreshTokenService],
})
export class AppModule {}
