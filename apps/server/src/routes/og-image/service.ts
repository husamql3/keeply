import { OgImageDAO } from "@/routes/og-image/dao";
import type { OgImageModel } from "@/routes/og-image/model";

export abstract class OgImageService {
	static async getById(id: string) {
		return OgImageDAO.getById(id);
	}

	static async getByUrl(url: string) {
		return OgImageDAO.getByUrl(url);
	}

	static async upsert(input: OgImageModel["createBody"]) {
		return OgImageDAO.upsert({
			id: crypto.randomUUID(),
			url: input.url,
			imageUrl: input.imageUrl ?? null,
			title: input.title ?? null,
			description: input.description ?? null,
			siteName: input.siteName ?? null,
			imageWidth: input.imageWidth ?? null,
			imageHeight: input.imageHeight ?? null,
			fetched: input.fetched ?? false,
			fetchedAt: input.fetchedAt ?? null,
		});
	}

	static async update(id: string, input: OgImageModel["updateBody"]) {
		return OgImageDAO.update(id, input);
	}
}
