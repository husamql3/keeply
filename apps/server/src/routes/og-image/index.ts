import { Elysia, status } from "elysia";

import { authMiddleware } from "@/middlewares/auth";

import { OgImageModel } from "./model";
import { OgImageService } from "./service";

export const ogImageRoute = new Elysia({ prefix: "/og-images" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ query }) => {
			if (!query.url) return status(400, { message: "url query param is required" });

			const found = await OgImageService.getByUrl(query.url);
			if (!found) return status(404, { message: "OG image not found" });

			return found;
		},
		{
			query: OgImageModel.lookupQuery,
			detail: {
				tags: ["OG Images"],
				summary: "Look up OG image by URL",
				description: "Retrieve cached OG metadata for a given URL",
			},
		},
	)
	.get(
		"/:id",
		async ({ params }) => {
			const found = await OgImageService.getById(params.id);
			if (!found) return status(404, { message: "OG image not found" });

			return found;
		},
		{
			params: OgImageModel.idParam,
			detail: {
				tags: ["OG Images"],
				summary: "Get OG image by ID",
				description: "Retrieve cached OG metadata by record ID",
			},
		},
	)
	.post(
		"/",
		async ({ session, body }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const upserted = await OgImageService.upsert(body);
			return status(201, upserted);
		},
		{
			body: OgImageModel.createBody,
			detail: {
				tags: ["OG Images"],
				summary: "Upsert OG image",
				description: "Create or update cached OG metadata for a URL",
			},
		},
	)
	.put(
		"/:id",
		async ({ params, session, body }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const updated = await OgImageService.update(params.id, body);
			if (!updated) return status(404, { message: "OG image not found" });

			return status(200, updated);
		},
		{
			params: OgImageModel.idParam,
			body: OgImageModel.updateBody,
			detail: {
				tags: ["OG Images"],
				summary: "Update OG image",
				description: "Update cached OG metadata fields by ID",
			},
		},
	);
