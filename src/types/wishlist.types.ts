import { z } from "zod";

export const wishlistSchema = z.object({
	email: z.email("Please enter a valid email address."),
});

export type WishlistForm = z.infer<typeof wishlistSchema>;
