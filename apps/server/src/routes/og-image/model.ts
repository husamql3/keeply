import { createInsertSchema } from "drizzle-typebox";
import { t, type UnwrapSchema } from "elysia";

import { ogImage } from "@/db/schema";

const insertSchema = createInsertSchema(ogImage, {
	url: t.String({ format: "uri", minLength: 1 }),
	imageUrl: t.Optional(t.String({ format: "uri" })),
	title: t.Optional(t.String({ maxLength: 500 })),
	description: t.Optional(t.String({ maxLength: 5000 })),
	siteName: t.Optional(t.String({ maxLength: 255 })),
	imageWidth: t.Optional(t.Integer({ minimum: 0 })),
	imageHeight: t.Optional(t.Integer({ minimum: 0 })),
});

const ogImageFields = [
	"url",
	"imageUrl",
	"title",
	"description",
	"siteName",
	"imageWidth",
	"imageHeight",
	"fetched",
	"fetchedAt",
] satisfies (keyof typeof ogImage.$inferInsert)[];

export const OgImageModel = {
	createBody: t.Pick(insertSchema, ogImageFields),
	updateBody: t.Partial(t.Pick(insertSchema, ogImageFields)),
	idParam: t.Object({
		id: t.String(),
	}),
	lookupQuery: t.Object({
		url: t.Optional(t.String({ format: "uri" })),
	}),
} as const;

export type OgImageModel = {
	[k in keyof typeof OgImageModel]: UnwrapSchema<(typeof OgImageModel)[k]>;
};
