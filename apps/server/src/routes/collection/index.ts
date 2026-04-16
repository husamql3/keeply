import { Elysia, status } from "elysia";

import { authMiddleware } from "@/middlewares/auth";

import { CollectionModel } from "./model";
import { CollectionService } from "./service";

export const collectionRoute = new Elysia({ prefix: "/collections" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ session }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			return CollectionService.list(session.user.id);
		},
		{
			detail: {
				tags: ["Collections"],
				summary: "List collections",
				description: "Get all collections belonging to the authenticated user",
			},
		},
	)
	.post(
		"/",
		async ({ session, body }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const created = await CollectionService.create(session.user.id, body);
			return status(201, created);
		},
		{
			body: CollectionModel.createBody,
			detail: {
				tags: ["Collections"],
				summary: "Create collection",
				description: "Create a new collection for the authenticated user",
			},
		},
	)
	.get(
		"/:id",
		async ({ params, session }) => {
			const found = await CollectionService.get(params.id);

			if (!found) return status(404, { message: "Collection not found" });
			if (found.privacy === "private" && found.userId !== session?.user.id) {
				return status(403, { message: "Forbidden" });
			}

			return found;
		},
		{
			params: CollectionModel.idParam,
			detail: {
				tags: ["Collections"],
				summary: "Get collection",
				description: "Get a collection by ID. Private collections are only accessible by the owner",
			},
		},
	)
	.put(
		"/:id",
		async ({ params, session, body }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const updated = await CollectionService.update(params.id, session.user.id, body);
			if (!updated) return status(404, { message: "Collection not found" });

			return status(200, updated);
		},
		{
			params: CollectionModel.idParam,
			body: CollectionModel.updateBody,
			detail: {
				tags: ["Collections"],
				summary: "Update collection",
				description: "Update a collection by ID. Only the owner can update",
			},
		},
	)
	.delete(
		"/:id",
		async ({ params, session }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const deleted = await CollectionService.delete(params.id, session.user.id);
			if (!deleted) return status(404, { message: "Collection not found" });

			return status(200, { message: "Collection deleted" });
		},
		{
			params: CollectionModel.idParam,
			detail: {
				tags: ["Collections"],
				summary: "Delete collection",
				description: "Delete a collection by ID. Only the owner can delete",
			},
		},
	);
