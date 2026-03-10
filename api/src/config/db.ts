import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { env } from "@/config/env";

export const dbConfig: TypeOrmModuleOptions = env.DATABASE_URL
	? {
			// Production: use DATABASE_URL connection URL
			type: "postgres",
			url: env.DATABASE_URL,
			synchronize: false,
			logging: false,
			autoLoadEntities: true,
			ssl: true,
		}
	: {
			// Development: use Docker DB with individual connection params
			type: "postgres",
			host: env.DB_HOST,
			port: env.DB_PORT,
			username: env.DB_USERNAME,
			password: env.DB_PASSWORD,
			database: env.DB_NAME,
			synchronize: true,
			logging: true,
			autoLoadEntities: true,
		};
