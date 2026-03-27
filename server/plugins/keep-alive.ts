import cron from "node-cron";

import { supabase } from "@/lib/supabase";

/**
 * This plugin pings the database every 3 days to prevent Supabase free-plan inactivity pause (pauses after 7 days)
 */
export default () => {
	cron.schedule("0 12 */3 * *", async () => {
		try {
			const { error } = await supabase.from("keeply_wishlist").select("*").limit(1);
			if (error) throw error;
			console.log("[keep-alive] Database ping successful");
		} catch (err) {
			console.error("[keep-alive] Database ping failed:", err);
		}
	});
};
