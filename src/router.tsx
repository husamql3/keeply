import { createRouter } from "@tanstack/react-router";

import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { queryClientSingleton } from "@/providers/react-query-provider";
import { routeTree } from "@/routeTree.gen";

export function getRouter() {
	const queryClient = queryClientSingleton();

	const router = createRouter({
		routeTree,
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
		context: {
			queryClient,
		},
		defaultPreload: "intent",
		// Since we're using React Query, we don't want loader calls to ever be stale
		// This will ensure that the loader is always called when the route is preloaded or visited
		defaultPreloadStaleTime: 0,
		scrollRestoration: true,
	});
	return router;
}
