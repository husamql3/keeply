import { createFileRoute } from "@tanstack/react-router";

import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/api/wishlist")({
	server: {
		handlers: {
			GET: async () => {
				const { count, error } = await supabase.from("keeply_wishlist").select("*", { count: "exact", head: true });
				if (error) {
					return Response.json({ error: error.message }, { status: 500 });
				}

				return Response.json(
					{
						count: count || 0,
					},
					{
						status: 200,
						headers: {
							"Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
						},
					},
				);
			},
		},
	},
});
