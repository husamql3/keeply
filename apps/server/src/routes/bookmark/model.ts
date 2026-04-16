import { createInsertSchema } from "drizzle-typebox";
import { t, type UnwrapSchema } from "elysia";

import { bookmark } from "@/db/schema";

const insertSchema = createInsertSchema(bookmark, {
	url: t.String({ format: "uri", minLength: 1 }),
	title: t.Optional(t.String({ maxLength: 500 })),
	description: t.Optional(t.String({ maxLength: 5000 })),
	collectionId: t.Optional(t.String()),
	sortOrder: t.Optional(t.Integer({ minimum: 0 })),
});

const bookmarkFields = [
	"url",
	"title",
	"description",
	"collectionId",
	"sourcePlatform",
	"isPinned",
	"isStarred",
	"sortOrder",
] satisfies (keyof typeof bookmark.$inferInsert)[];

export const BookmarkModel = {
	createBody: t.Pick(insertSchema, bookmarkFields),
	updateBody: t.Partial(t.Pick(insertSchema, bookmarkFields)),
	idParam: t.Object({
		id: t.String(),
	}),
	listQuery: t.Object({
		collectionId: t.Optional(t.String()),
	}),
} as const;

export type BookmarkModel = {
	[k in keyof typeof BookmarkModel]: UnwrapSchema<(typeof BookmarkModel)[k]>;
};
