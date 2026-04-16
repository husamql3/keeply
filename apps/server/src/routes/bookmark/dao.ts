import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { bookmark } from "@/db/schema";

import type { BookmarkModel } from "./model";

type BookmarkInsert = typeof bookmark.$inferInsert;

export abstract class BookmarkDAO {
	static async list(userId: string, collectionId?: string) {
		const conditions = [eq(bookmark.userId, userId)];
		if (collectionId) conditions.push(eq(bookmark.collectionId, collectionId));
		return db
			.select()
			.from(bookmark)
			.where(and(...conditions));
	}

	static async create(values: BookmarkInsert) {
		const [created] = await db.insert(bookmark).values(values).returning();
		return created!;
	}

	static async get(id: string) {
		const [found] = await db.select().from(bookmark).where(eq(bookmark.id, id));
		return found ?? null;
	}

	static async update(id: string, userId: string, input: BookmarkModel["updateBody"]) {
		const [updated] = await db
			.update(bookmark)
			.set(input)
			.where(and(eq(bookmark.id, id), eq(bookmark.userId, userId)))
			.returning();
		return updated ?? null;
	}

	static async delete(id: string, userId: string) {
		const [deleted] = await db
			.delete(bookmark)
			.where(and(eq(bookmark.id, id), eq(bookmark.userId, userId)))
			.returning();
		return deleted ?? null;
	}
}
