import "@/lib/sentry";
import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { Toaster } from "sileo";

import appCss from "@/app.css?url";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { seo } from "@/utils/seo";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title: "Keeply - Save Everything. Find Anything.",
				description:
					"Keeply is a bookmark manager that helps you save, organize, and find anything from the web. Collections, tags, full-text search, and more - beautifully organized.",
				keywords:
					"bookmark manager,save links,organize bookmarks,personal internet archive,bookmark collections,tag bookmarks,read later app,link organizer,bookmark app,web clipper",
			}),
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/icon.png" },
			{ rel: "shortcut icon", href: "/icon.png" },
			{ rel: "manifest", href: "/site.webmanifest" },
		],
	}),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext();

	return (
		<html>
			<head>
				<HeadContent />
			</head>
			<body className="dark">
				<Sentry.ErrorBoundary
					fallback={({ error, resetError }) => (
						<DefaultCatchBoundary
							error={error as Error}
							reset={resetError}
						/>
					)}
				>
					<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
				</Sentry.ErrorBoundary>
				<TanStackRouterDevtools position="bottom-right" />
				<Toaster
					position="top-center"
					theme="dark"
				/>
				<Scripts />
			</body>
		</html>
	);
}
