import { ConsoleLogger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

import { AppModule } from "@/app.module";
import { env } from "@/config/env";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger({
			prefix: "keeply",
			sorted: true,
		}),
	});

	app.setGlobalPrefix("api");

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

	app.enableCors({
		origin: env.NODE_ENV === "production" ? [] : ["http://localhost:3000"],
		credentials: true,
	});

	const options = new DocumentBuilder()
		.setTitle("Keeply API")
		.setDescription("Keeply API documentation")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, options);

	app.use(
		"/api/reference",
		apiReference({
			theme: "kepler",
			content: document,
		}),
	);

	await app.listen(env.PORT);
}

bootstrap().catch(console.error);
