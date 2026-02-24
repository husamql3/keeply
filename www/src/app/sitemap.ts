import type { MetadataRoute } from "next";

// TODO: replace with your actual DB query to fetch public collections
// e.g. import { db } from "@/lib/db";
// const collections = await db.collection.findMany({ where: { privacy: "PUBLIC" } });

const BASE_URL = "https://keeply.cc";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// --- Static routes ---
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		// {
		//   url: `${BASE_URL}/login`,
		//   lastModified: new Date(),
		//   changeFrequency: "yearly",
		//   priority: 0.3,
		// },
		// {
		//   url: `${BASE_URL}/signup`,
		//   lastModified: new Date(),
		//   changeFrequency: "yearly",
		//   priority: 0.5,
		// },
	];

	// --- Dynamic routes (public collections) ---
	// Uncomment and adapt once your DB is set up:
	//
	// const collections = await db.collection.findMany({
	// 	where: { privacy: "PUBLIC" },
	// 	select: { slug: true, updatedAt: true },
	// });
	//
	// const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
	// 	url: `${BASE_URL}/c/${c.slug}`,
	// 	lastModified: c.updatedAt,
	// 	changeFrequency: "weekly",
	// 	priority: 0.7,
	// }));
	//
	// return [...staticRoutes, ...collectionRoutes];

	return staticRoutes;
}
