import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";

export function useWishlist() {
	const queryClient = useQueryClient();

	const {
		data: countData,
		isLoading: isLoadingCount,
		error: errorCount,
	} = useQuery({
		queryKey: ["wishlist"],
		queryFn: async () => {
			const response = await fetch("/api/wishlist");
			if (!response.ok) throw new Error("Failed to fetch wishlist count");
			return response.json() as Promise<{ count: number }>;
		},
	});

	const {
		mutateAsync: joinWishlist,
		isPending: isJoiningWishlist,
		error: errorJoining,
	} = useMutation({
		mutationFn: async (email: string) => {
			const response = await fetch("/api/join-wishlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = (await response.json()) as { error?: string; message?: string };
			if (!response.ok) throw new Error(data.error ?? "Failed to join waitlist");
			return data as { message: string };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["wishlist"] });
		},
	});

	const join = (email: string) => {
		const promise = joinWishlist(email);

		sileo.promise(promise, {
			loading: { title: "Joining waitlist...", description: "Please wait" },
			success: (data) => ({ title: "You're in!", description: data.message }),
			error: (error) => ({
				title: "Failed to join waitlist",
				description: error instanceof Error ? error.message : "Please try again.",
			}),
		});

		return promise;
	};

	return {
		count: countData?.count ?? null,
		isLoadingCount,
		errorCount,
		join,
		isJoiningWishlist,
		errorJoining,
	};
}
