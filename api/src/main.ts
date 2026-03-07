import { ConsoleLogger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger({
			prefix: "keeply",
			sorted: true,
		}),
	});

	app.setGlobalPrefix("api");

	const options = new DocumentBuilder()
		.setTitle("Keeply API")
		.setDescription("Keeply API documentation")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api/docs", app, document);

	app.use(
		"/api/reference",
		apiReference({
			theme: "kepler",
			content: document,
		}),
	);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
