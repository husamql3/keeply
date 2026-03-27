import { zodResolver } from "@hookform/resolvers/zod";
import { IconAt } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Grainient } from "@/components/grainient";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useWishlist } from "@/hooks/use-wishlist";
import { WishlistForm, wishlistSchema } from "@/types/wishlist.types";
import { formatWaitlistCount } from "@/utils/format-wishlist-count";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { count: waitlistCount, isLoadingCount, join } = useWishlist();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<WishlistForm>({
		resolver: zodResolver(wishlistSchema),
	});

	const onSubmit = async ({ email }: WishlistForm) => {
		await join(email);
		reset();
	};

	return (
		<div className="flex h-dvh items-center justify-center relative px-4 sm:px-6 py-8">
			<div className="w-full h-full absolute bottom-0 left-0 pointer-events-none select-none touch-none opacity-20">
				<Grainient
					color1="#4a94a2"
					color2="#a3bf90"
					color3="#000000"
					timeSpeed={0.25}
					colorBalance={0}
					warpStrength={1}
					warpFrequency={5}
					warpSpeed={2}
					warpAmplitude={50}
					blendAngle={0}
					blendSoftness={0.05}
					rotationAmount={500}
					noiseScale={2}
					grainAmount={0.1}
					grainScale={2}
					grainAnimated={false}
					contrast={1.5}
					gamma={0.9}
					saturation={1}
					centerX={0}
					centerY={0}
					zoom={0.8}
				/>
			</div>

			<div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
				<img
					src="/icon-light.png"
					alt="Keeply"
					width={60}
					height={60}
					className="mb-4 sm:mb-6 w-12 h-12 sm:w-[60px] sm:h-[60px]"
					loading="eager"
				/>

				<div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 px-2">
					<h2 className="text-center font-semibold text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
						Save Everything. Find Anything.
					</h2>
					<p className="text-balance text-center text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
						We're Building Something You'll Love.
						<br />
						Sign up and we'll let you know the moment it's ready.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-md px-2"
				>
					<div className="flex flex-col gap-1.5">
						<Field className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 relative">
							<FieldLabel
								htmlFor="email-input"
								className="sr-only"
							>
								Email address
							</FieldLabel>

							<InputGroup className="w-full flex-1">
								<InputGroupAddon>
									<IconAt className="text-muted-foreground size-4" />
								</InputGroupAddon>
								<InputGroupInput
									id="email-input"
									placeholder="Enter your email"
									size={14}
									type="email"
									disabled={isSubmitting}
									aria-invalid={!!errors.email}
									className="bg-zinc-900 w-full flex-1 text-sm sm:text-base"
									{...register("email")}
								/>
							</InputGroup>

							<div className="w-full! sm:w-fit! relative">
								<Button
									type="submit"
									variant="default"
									disabled={isSubmitting}
									className="w-full sm:w-auto text-sm sm:text-base"
								>
									Get early access
								</Button>
								<img
									src="/dashs.svg"
									alt=""
									width={50}
									height={50}
									className="absolute -top-5 -right-3 sm:-top-5 sm:-right-7 size-6 sm:size-7 pointer-events-none select-none touch-none hidden sm:block"
								/>
							</div>
						</Field>
						<FieldError errors={[errors.email]} />
					</div>
				</form>

				<div className="flex items-center gap-2 p-2! bg-transparent! border-none!">
					{isLoadingCount ? (
						<div className="text-muted-foreground me-1.5 text-xs flex items-center gap-1.5">
							<span>Joined by</span>
							<span className="inline-block bg-muted animate-pulse rounded h-4 w-6" />
							<span>developers.</span>
						</div>
					) : waitlistCount !== null && waitlistCount > 0 ? (
						<p className="text-muted-foreground me-1.5 text-xs">
							Joined by{" "}
							<span className="text-foreground font-semibold">
								{formatWaitlistCount(waitlistCount) || waitlistCount}
							</span>{" "}
							developers.
						</p>
					) : null}
				</div>
			</div>
		</div>
	);
}
