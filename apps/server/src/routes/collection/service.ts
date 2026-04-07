import { CollectionDAO } from "@/routes/collection/dao";
import type { CollectionModel } from "@/routes/collection/model";
import { generateSlug } from "@/routes/collection/utils";

export abstract class CollectionService {
	static async list(userId: string) {
		return CollectionDAO.list(userId);
	}

	static async create(userId: string, input: CollectionModel["createBody"]) {
		const slug = input.slug ?? generateSlug(input.name);
		return CollectionDAO.create({
			userId,
			name: input.name,
			description: input.description ?? null,
			privacy: input.privacy ?? "private",
			slug,
			isPinned: input.isPinned ?? false,
			coverImageUrl: input.coverImageUrl ?? null,
		});
	}

	static async get(id: string) {
		return CollectionDAO.get(id);
	}

	static async update(id: string, userId: string, input: CollectionModel["updateBody"]) {
		return CollectionDAO.update(id, userId, input);
	}

	static async delete(id: string, userId: string) {
		return CollectionDAO.delete(id, userId);
	}
}
