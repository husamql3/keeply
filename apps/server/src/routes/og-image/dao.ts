import { eq } from "drizzle-orm";

import { db } from "@/db";
import { ogImage } from "@/db/schema";

import type { OgImageModel } from "./model";

type OgImageInsert = typeof ogImage.$inferInsert;

export abstract class OgImageDAO {
	static async getById(id: string) {
		const [found] = await db.select().from(ogImage).where(eq(ogImage.id, id));
		return found ?? null;
	}

	static async getByUrl(url: string) {
		const [found] = await db.select().from(ogImage).where(eq(ogImage.url, url));
		return found ?? null;
	}

	static async create(values: OgImageInsert) {
		const [created] = await db.insert(ogImage).values(values).returning();
		return created!;
	}

	static async upsert(values: OgImageInsert) {
		const [upserted] = await db
			.insert(ogImage)
			.values(values)
			.onConflictDoUpdate({
				target: ogImage.url,
				set: {
					imageUrl: values.imageUrl,
					title: values.title,
					description: values.description,
					siteName: values.siteName,
					imageWidth: values.imageWidth,
					imageHeight: values.imageHeight,
					fetched: values.fetched,
					fetchedAt: values.fetchedAt,
				},
			})
			.returning();
		return upserted!;
	}

	static async update(id: string, input: OgImageModel["updateBody"]) {
		const [updated] = await db.update(ogImage).set(input).where(eq(ogImage.id, id)).returning();
		return updated ?? null;
	}
}
