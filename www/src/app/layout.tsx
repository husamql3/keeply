import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sileo";

import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Keeply - Save Everything. Find Anything.",
		template: "%s | Keeply",
	},
	description:
		"Keeply is a bookmark manager that helps you save, organize, and find anything from the web. Collections, tags, full-text search, and more - beautifully organized.",
	keywords: [
		"bookmark manager",
		"save links",
		"organize bookmarks",
		"personal internet archive",
		"bookmark collections",
		"tag bookmarks",
		"read later app",
		"link organizer",
		"bookmark app",
		"web clipper",
	],
	authors: [{ name: "Keeply" }],
	creator: "Keeply",
	metadataBase: new URL("https://keeply.cc"),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://keeply.cc",
		siteName: "Keeply",
		title: "Keeply - Your Personal Internet Archive",
		description:
			"Save everything. Find anything. Keeply helps you organize the internet your way - with collections, tags, and powerful search.",
		// images: [
		// 	{
		// 		url: "/og-image.png", // create a 1200x630 image
		// 		width: 1200,
		// 		height: 630,
		// 		alt: "Keeply - Your Personal Internet Archive",
		// 	},
		// ],
	},
	twitter: {
		card: "summary_large_image",
		title: "Keeply - Your Personal Internet Archive",
		description: "Save everything. Find anything. Keeply helps you organize the internet your way.",
		// images: ["/og-image.png"],
		creator: "@keep1y",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/icon.png",
		shortcut: "/icon.png",
		// apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	category: "productivity",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(dmSans.variable, "bg-zinc-950 antialiased dark")}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "SoftwareApplication",
							name: "Keeply",
							applicationCategory: "ProductivityApplication",
							operatingSystem: "Web",
							description:
								"Keeply is a bookmark manager that helps you save, organize, and find anything from the web with collections, tags, and full-text search.",
							offers: {
								"@type": "Offer",
								price: "0",
								priceCurrency: "USD",
							},
							url: "https://keeply.cc",
						}),
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Keeply",
							url: "https://keeply.cc",
							logo: "https://keeply.cc/icon.png",
							sameAs: [],
						}),
					}}
				/>
				{children}
				<Toaster
					position="top-center"
					theme="dark"
				/>
				<div className="hidden lg:block">
					<SmoothCursor
						springConfig={{
							damping: 45,
							stiffness: 600,
							mass: 1,
							restDelta: 0.001,
						}}
					/>
				</div>
				<Analytics />
			</body>
		</html>
	);
}
