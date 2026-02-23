"use client";

import { MailIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { sileo } from "sileo";

import { Grainient } from "@/components/grainient";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export default function Home() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleJoinWaitlist = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !email.includes("@")) {
			sileo.error({
				title: "Invalid email",
				description: "Please enter a valid email address.",
			});
			return;
		}

		setIsSubmitting(true);

		const waitlistPromise = fetch("/api/join-wishlist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		})
			.then(async (response) => {
				const data = await response.json();

				if (!response.ok) {
					throw new Error((data as { error: string }).error || "Failed to join waitlist");
				}

				setEmail("");
				return data;
			})
			.finally(() => {
				setIsSubmitting(false);
			});

		sileo.promise(waitlistPromise, {
			loading: { title: "Joining waitlist...", description: "Please wait" },
			success: (data) => ({
				title: "You're in!",
				description: (data as { message: string }).message,
			}),
			error: (error) => ({
				title: "Failed to join waitlist",
				description: error instanceof Error ? error.message : "Please try again.",
			}),
		});
	};

	return (
		<div className="flex min-h-screen items-center justify-center relative">
			{/* <div className="rotate-180 w-full h-full absolute bottom-0 left-0 pointer-events-none select-none touch-none opacity-30">
				<DarkVeil
					speed={1}
					hueShift={66}
					noiseIntensity={0.2}
					scanlineIntensity={0}
					scanlineFrequency={0.5}
					warpAmount={0}
					resolutionScale={1}
				/>
			</div> */}

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

			<div className="relative z-10 flex flex-col items-center justify-center">
				<Image
					src="/icon.png"
					alt="Keeply"
					width={60}
					height={60}
					className="mb-4"
					priority
					loading="eager"
				/>

				<div className="space-y-1 mb-2">
					<h2 className="text-center font-semibold text-2xl tracking-tight md:text-4xl">Get In Before It’s Crowded</h2>
					<p className="text-balance text-center text-muted-foreground text-sm md:text-base">
						Join the waitlist and be among the first to organize the internet your way.
					</p>
				</div>

				<form
					onSubmit={handleJoinWaitlist}
					className="max-w-md w-full mt-6 mb-2"
				>
					<Field className="flex flex-row items-center relative">
						<FieldLabel
							htmlFor="email-input"
							className="sr-only"
						>
							Email address
						</FieldLabel>

						<InputGroup className="w-full flex-1">
							<InputGroupAddon>
								<MailIcon className="text-muted-foreground" />
							</InputGroupAddon>
							<InputGroupInput
								id="email-input"
								placeholder="Enter your email"
								size={14}
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isSubmitting}
								required
								className="bg-zinc-900 w-full flex-1"
							/>
						</InputGroup>

						<div className="w-fit! relative">
							<Button
								type="submit"
								variant="default"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Joining..." : "Join Waitlist"}
							</Button>
							<Image
								src="/dashs.svg"
								alt="Keeply"
								loading="eager"
								width={50}
								height={50}
								className="absolute -top-5 -right-7 size-7 pointer-events-none select-none touch-none"
								priority
							/>
						</div>
					</Field>
				</form>

				{/* <div className="flex items-center gap-2 p-2! bg-transparent! border-none!">
					<p className="text-muted-foreground me-1.5 text-xs">
						Joined by <span className="text-foreground font-semibold">500+</span> developers.
					</p>
				</div> */}
			</div>
		</div>
	);
}
