import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
	}

	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
	}

	const domain = parsed.hostname.replace(/^www\./, "");
	const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept: "text/html,application/xhtml+xml",
			},
			signal: AbortSignal.timeout(6000),
			redirect: "follow",
		});

		if (!response.ok) {
			return NextResponse.json({ title: domain, favicon, domain });
		}

		const html = await response.text();

		// Prefer OG title over page title
		const ogTitle =
			html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{1,200})["']/i)?.[1] ??
			html.match(/<meta[^>]+content=["']([^"']{1,200})["'][^>]+property=["']og:title["']/i)?.[1];

		const pageTitle = html.match(/<title[^>]*>([^<]{1,200})<\/title>/i)?.[1];

		const rawTitle = ogTitle ?? pageTitle ?? domain;
		const title = rawTitle
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#039;/g, "'")
			.replace(/&quot;/g, '"')
			.trim();

		return NextResponse.json({ title, favicon, domain });
	} catch {
		return NextResponse.json({ title: domain, favicon, domain });
	}
}
