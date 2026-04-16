import { Elysia, status } from "elysia";

import { authMiddleware } from "@/middlewares/auth";

import { BookmarkModel } from "./model";
import { BookmarkService } from "./service";

export const bookmarkRoute = new Elysia({ prefix: "/bookmarks" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ session, query }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			return BookmarkService.list(session.user.id, query.collectionId);
		},
		{
			query: BookmarkModel.listQuery,
			detail: {
				tags: ["Bookmarks"],
				summary: "List bookmarks",
				description: "Get all bookmarks belonging to the authenticated user, optionally filtered by collection",
			},
		},
	)
	.post(
		"/",
		async ({ session, body }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const created = await BookmarkService.create(session.user.id, body);
			return status(201, created);
		},
		{
			body: BookmarkModel.createBody,
			detail: {
				tags: ["Bookmarks"],
				summary: "Create bookmark",
				description: "Create a new bookmark for the authenticated user",
			},
		},
	)
	.get(
		"/:id",
		async ({ params, session }) => {
			const found = await BookmarkService.get(params.id);

			if (!found) return status(404, { message: "Bookmark not found" });
			if (found.userId !== session?.user.id) return status(403, { message: "Forbidden" });

			return found;
		},
		{
			params: BookmarkModel.idParam,
			detail: {
				tags: ["Bookmarks"],
				summary: "Get bookmark",
				description: "Get a bookmark by ID. Only accessible by the owner",
			},
		},
	)
	.put(
		"/:id",
		async ({ params, session, body }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const updated = await BookmarkService.update(params.id, session.user.id, body);
			if (!updated) return status(404, { message: "Bookmark not found" });

			return status(200, updated);
		},
		{
			params: BookmarkModel.idParam,
			body: BookmarkModel.updateBody,
			detail: {
				tags: ["Bookmarks"],
				summary: "Update bookmark",
				description: "Update a bookmark by ID. Only the owner can update",
			},
		},
	)
	.delete(
		"/:id",
		async ({ params, session }) => {
			if (!session) return status(401, { message: "Unauthorized" });

			const deleted = await BookmarkService.delete(params.id, session.user.id);
			if (!deleted) return status(404, { message: "Bookmark not found" });

			return status(200, { message: "Bookmark deleted" });
		},
		{
			params: BookmarkModel.idParam,
			detail: {
				tags: ["Bookmarks"],
				summary: "Delete bookmark",
				description: "Delete a bookmark by ID. Only the owner can delete",
			},
		},
	);
