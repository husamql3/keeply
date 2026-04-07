import { createInsertSchema } from "drizzle-typebox";
import { t, type UnwrapSchema } from "elysia";

import { collection } from "@/db/schema";

const insertSchema = createInsertSchema(collection, {
	name: t.String({ minLength: 1, maxLength: 100 }),
	description: t.Optional(t.String({ maxLength: 500 })),
	slug: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
});

const collectionFields = [
	"name",
	"description",
	"privacy",
	"slug",
	"isPinned",
	"coverImageUrl",
] satisfies (keyof typeof collection.$inferInsert)[];

export const CollectionModel = {
	createBody: t.Pick(insertSchema, collectionFields),
	updateBody: t.Partial(t.Pick(insertSchema, collectionFields)),
	idParam: t.Object({
		id: t.String({ format: "uuid" }),
	}),
} as const;

export type CollectionModel = {
	[k in keyof typeof CollectionModel]: UnwrapSchema<(typeof CollectionModel)[k]>;
};
