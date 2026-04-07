import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum, integer, uuid } from "drizzle-orm/pg-core";

// ─── Auth tables (unchanged) ──────────────────────────────────────────────────

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ─── Enums ────────────────────────────────────────────────────────────────────

/** Privacy level for collections — maps to Phase 1 requirements. */
export const collectionPrivacyEnum = pgEnum("collection_privacy", [
	"private", // owner-only
	"unlisted", // anyone with the link
	"public", // discoverable in directory
]);

/**
 * Platform the bookmark was captured from.
 * Extensible — add values here as new sources are integrated.
 */
export const sourcePlatformEnum = pgEnum("source_platform", [
	"web", // generic browser / extension save
	"manual", // entered through the manual entry form
	"github",
	"twitter",
	"youtube",
	"reddit",
	"linkedin",
	"other",
]);

// ─── OG Image cache ──────────────────────────────────────────────────────────

/**
 * Stores fetched Open Graph metadata for a URL so we never re-fetch the same
 * URL twice.  Collections can also reference a row here as their cover image.
 */
export const ogImage = pgTable(
	"og_image",
	{
		id: text("id").primaryKey(),

		/** Normalised URL that was used to fetch OG data. */
		url: text("url").notNull().unique(),

		/** og:image resolved to an absolute URL. */
		imageUrl: text("image_url"),

		/** og:title fallback — used when the user hasn't set a custom title. */
		title: text("title"),

		/** og:description fallback. */
		description: text("description"),

		/** og:site_name */
		siteName: text("site_name"),

		/** og:image width/height, used for layout hints. */
		imageWidth: integer("image_width"),
		imageHeight: integer("image_height"),

		/** Whether a fetch has been attempted (even if it returned nothing). */
		fetched: boolean("fetched").default(false).notNull(),

		fetchedAt: timestamp("fetched_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("og_image_url_idx").on(table.url)],
);

// ─── Collections ─────────────────────────────────────────────────────────────

export const collection = pgTable(
	"collection",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		name: text("name").notNull(),
		description: text("description"),

		privacy: collectionPrivacyEnum("privacy").default("private").notNull(),

		/**
		 * Custom cover image uploaded by the user, stored as a URL
		 * (e.g. an object-storage key resolved through your CDN).
		 * When null the UI falls back to the first bookmark's OG image.
		 */
		coverImageUrl: text("cover_image_url"),

		/**
		 * Optionally pin a specific ogImage row as the auto-generated cover.
		 * Populated by the server when coverImageUrl is null.
		 */
		coverOgImageId: text("cover_og_image_id").references(() => ogImage.id, {
			onDelete: "set null",
		}),

		/** Slug used in shareable URLs  e.g. /c/<slug>  */
		slug: text("slug").notNull().unique(),

		isPinned: boolean("is_pinned").default(false).notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("collection_userId_idx").on(table.userId), index("collection_privacy_idx").on(table.privacy)],
);

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const tag = pgTable(
	"tag",
	{
		id: text("id").primaryKey(),

		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		name: text("name").notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("tag_userId_idx").on(table.userId),
		// Unique tag name per user
		index("tag_userId_name_idx").on(table.userId, table.name),
	],
);

// ─── Bookmarks ───────────────────────────────────────────────────────────────

export const bookmark = pgTable(
	"bookmark",
	{
		id: text("id").primaryKey(),

		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		collectionId: text("collection_id").references(() => collection.id, {
			onDelete: "set null",
		}),

		/** The canonical saved URL. */
		url: text("url").notNull(),

		/**
		 * User-overridden title.  When null, the UI displays ogImage.title
		 * or the raw URL hostname as fallback.
		 */
		title: text("title"),

		/** User-written notes / description. */
		description: text("description"),

		/** Cached OG metadata for this URL. */
		ogImageId: text("og_image_id").references(() => ogImage.id, {
			onDelete: "set null",
		}),

		sourcePlatform: sourcePlatformEnum("source_platform").default("manual").notNull(),

		isPinned: boolean("is_pinned").default(false).notNull(),
		isStarred: boolean("is_starred").default(false).notNull(),

		/**
		 * Manual sort position within a collection.
		 * Lower value = higher position. Managed by the drag-and-drop layer.
		 */
		sortOrder: integer("sort_order").default(0).notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("bookmark_userId_idx").on(table.userId),
		index("bookmark_collectionId_idx").on(table.collectionId),
		index("bookmark_ogImageId_idx").on(table.ogImageId),
		// Enables fast duplicate detection per user
		index("bookmark_userId_url_idx").on(table.userId, table.url),
	],
);

// ─── Bookmark ↔ Tag join table ───────────────────────────────────────────────

export const bookmarkTag = pgTable(
	"bookmark_tag",
	{
		bookmarkId: text("bookmark_id")
			.notNull()
			.references(() => bookmark.id, { onDelete: "cascade" }),

		tagId: text("tag_id")
			.notNull()
			.references(() => tag.id, { onDelete: "cascade" }),

		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("bookmark_tag_bookmarkId_idx").on(table.bookmarkId),
		index("bookmark_tag_tagId_idx").on(table.tagId),
	],
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	collections: many(collection),
	bookmarks: many(bookmark),
	tags: many(tag),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const collectionRelations = relations(collection, ({ one, many }) => ({
	user: one(user, { fields: [collection.userId], references: [user.id] }),
	coverOgImage: one(ogImage, {
		fields: [collection.coverOgImageId],
		references: [ogImage.id],
	}),
	bookmarks: many(bookmark),
}));

export const ogImageRelations = relations(ogImage, ({ many }) => ({
	bookmarks: many(bookmark),
	collections: many(collection),
}));

export const bookmarkRelations = relations(bookmark, ({ one, many }) => ({
	user: one(user, { fields: [bookmark.userId], references: [user.id] }),
	collection: one(collection, {
		fields: [bookmark.collectionId],
		references: [collection.id],
	}),
	ogImage: one(ogImage, {
		fields: [bookmark.ogImageId],
		references: [ogImage.id],
	}),
	bookmarkTags: many(bookmarkTag),
}));

export const tagRelations = relations(tag, ({ one, many }) => ({
	user: one(user, { fields: [tag.userId], references: [user.id] }),
	bookmarkTags: many(bookmarkTag),
}));

export const bookmarkTagRelations = relations(bookmarkTag, ({ one }) => ({
	bookmark: one(bookmark, {
		fields: [bookmarkTag.bookmarkId],
		references: [bookmark.id],
	}),
	tag: one(tag, { fields: [bookmarkTag.tagId], references: [tag.id] }),
}));
