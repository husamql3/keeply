"use client";

import { MailIcon } from "lucide-react";
import Image from "next/image";
import { sileo } from "sileo";

import { DarkVeil } from "@/components/dark-veil";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export default function Home() {
	const handleJoinWaitlist = () => {
		sileo.promise(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
			loading: { title: "Joining waitlist..." },
			success: { title: "You're in!" },
			error: { title: "Failed to join waitlist" },
		});
	};

	return (
		<div className="flex min-h-screen items-center justify-center relative">
			<div className="rotate-180 w-full h-full absolute bottom-0 left-0 pointer-events-none select-none touch-none opacity-30">
				<DarkVeil
					speed={1}
					hueShift={66}
					noiseIntensity={0.2}
					scanlineIntensity={0}
					scanlineFrequency={0.5}
					warpAmount={0}
					resolutionScale={1}
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

				<Field className="max-w-md w-full flex flex-row items-center mt-6 mb-2 relative">
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
							className="bg-zinc-900 w-full flex-1"
						/>
					</InputGroup>

					<div className="w-fit! relative">
						<Button
							variant="default"
							onClick={handleJoinWaitlist}
						>
							Join Waitlist
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

				<div className="flex items-center gap-2 p-2! bg-transparent! border-none!">
					<AvatarGroup>
						<Avatar className="size-7">
							<AvatarImage
								src="https://github.com/shadcn.png"
								alt="@shadcn"
							/>
							<AvatarFallback>CH</AvatarFallback>
						</Avatar>
						<Avatar className="size-7">
							<AvatarImage
								src="https://github.com/maxleiter.png"
								alt="@maxleiter"
							/>
							<AvatarFallback>CH</AvatarFallback>
						</Avatar>
						<Avatar className="size-7">
							<AvatarImage
								src="https://github.com/evilrabbit.png"
								alt="@evilrabbit"
							/>
							<AvatarFallback>CH</AvatarFallback>
						</Avatar>
						<Avatar className="size-7">
							<AvatarImage
								src="https://github.com/leerob.png"
								alt="@leerob"
							/>
							<AvatarFallback>CH</AvatarFallback>
						</Avatar>
					</AvatarGroup>
					<p className="text-muted-foreground me-1.5 text-xs">
						Joined by <span className="text-foreground font-semibold">500+</span> developers.
					</p>
				</div>
			</div>
		</div>
	);
}
