import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function GET() {
	try {
		const { count, error } = await supabase.from("keeply_wishlist").select("*", { count: "exact", head: true });

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{
				count: count || 0,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching wishlist count:", error);
		return NextResponse.json({ error: "Failed to fetch wishlist count" }, { status: 500 });
	}
}
