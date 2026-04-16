import { BookmarkDAO } from "@/routes/bookmark/dao";
import type { BookmarkModel } from "@/routes/bookmark/model";

export abstract class BookmarkService {
	static async list(userId: string, collectionId?: string) {
		return BookmarkDAO.list(userId, collectionId);
	}

	static async create(userId: string, input: BookmarkModel["createBody"]) {
		return BookmarkDAO.create({
			id: crypto.randomUUID(),
			userId,
			url: input.url,
			title: input.title ?? null,
			description: input.description ?? null,
			collectionId: input.collectionId ?? null,
			sourcePlatform: input.sourcePlatform ?? "manual",
			isPinned: input.isPinned ?? false,
			isStarred: input.isStarred ?? false,
			sortOrder: input.sortOrder ?? 0,
		});
	}

	static async get(id: string) {
		return BookmarkDAO.get(id);
	}

	static async update(id: string, userId: string, input: BookmarkModel["updateBody"]) {
		return BookmarkDAO.update(id, userId, input);
	}

	static async delete(id: string, userId: string) {
		return BookmarkDAO.delete(id, userId);
	}
}
