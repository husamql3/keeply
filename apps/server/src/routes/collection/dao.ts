import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { collection } from "@/db/schema";

import type { CollectionModel } from "./model";

type CollectionInsert = typeof collection.$inferInsert;

export abstract class CollectionDAO {
	static async list(userId: string) {
		return db.select().from(collection).where(eq(collection.userId, userId));
	}

	static async create(values: CollectionInsert) {
		const [created] = await db.insert(collection).values(values).returning();
		return created!;
	}

	static async get(id: string) {
		const [found] = await db.select().from(collection).where(eq(collection.id, id));
		return found ?? null;
	}

	static async update(id: string, userId: string, input: CollectionModel["updateBody"]) {
		const [updated] = await db
			.update(collection)
			.set(input)
			.where(and(eq(collection.id, id), eq(collection.userId, userId)))
			.returning();
		return updated ?? null;
	}

	static async delete(id: string, userId: string) {
		const [deleted] = await db
			.delete(collection)
			.where(and(eq(collection.id, id), eq(collection.userId, userId)))
			.returning();
		return deleted ?? null;
	}
}
