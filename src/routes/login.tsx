import { zodResolver } from "@hookform/resolvers/zod";
import { IconAt, IconHash } from "@tabler/icons-react";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getSession } from "@/utils/functions/auth";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

const emailSchema = z.object({
	email: z.email("Please enter a valid email address."),
});

const otpSchema = z.object({
	otp: z.string().length(6, "Code must be 6 digits.").regex(/^\d+$/, "Code must be numeric."),
});

type EmailValues = z.infer<typeof emailSchema>;
type OtpValues = z.infer<typeof otpSchema>;

function RouteComponent() {
	const navigate = useNavigate();
	const [step, setStep] = useState<"email" | "otp">("email");
	const [email, setEmail] = useState("");

	const emailForm = useForm<EmailValues>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});

	const otpForm = useForm<OtpValues>({
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: "" },
	});

	const handleSendOtp = async ({ email }: EmailValues) => {
		const promise = authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" }).then(({ error }) => {
			if (error) throw new Error(error.message ?? "Failed to send code.");
		});

		sileo.promise(promise, {
			loading: { title: "Sending code...", description: "Please wait" },
			success: { title: "Code sent!", description: "Check your inbox." },
			error: (error) => ({
				title: "Failed to send code",
				description: error instanceof Error ? error.message : "Please try again.",
			}),
		});

		try {
			await promise;
			setEmail(email);
			setStep("otp");
		} catch {}
	};

	const handleVerifyOtp = async ({ otp }: OtpValues) => {
		const promise = authClient.signIn.emailOtp({ email, otp }).then(({ error }) => {
			if (error) throw new Error(error.message ?? "Invalid code. Please try again.");
		});

		sileo.promise(promise, {
			loading: { title: "Verifying code...", description: "Please wait" },
			success: { title: "Welcome to Keeply!", description: "You're now logged in." },
			error: (error) => ({
				title: "Invalid code",
				description: error instanceof Error ? error.message : "Please try again.",
			}),
		});

		try {
			await promise;
			navigate({ to: "/" });
		} catch {}
	};

	return (
		<div className="relative w-full overflow-hidden md:h-screen">
			<div className={cn("relative mx-auto flex min-h-screen w-full max-w-sm flex-col justify-between p-6 md:p-8")}>
				<div className="flex justify-center">
					<Link to="/">
						<img
							src="/icon-light.png"
							alt="Keeply"
							width={40}
							height={40}
							className="mb-4 h-10 w-10 sm:mb-6 sm:h-[40px] sm:w-[40px]"
							loading="eager"
						/>
					</Link>
				</div>

				<div className="fade-in slide-in-from-bottom-4 animate-in w-full space-y-4 duration-600">
					<div className="flex flex-col space-y-1">
						<h1 className="text-2xl font-bold tracking-wide">Join Now!</h1>
						<p className="text-muted-foreground text-base">
							{step === "email" ? "Login or create your Keeply account." : `Enter the code sent to ${email}.`}
						</p>
					</div>

					{step === "email" ? (
						<form
							className="space-y-2"
							onSubmit={emailForm.handleSubmit(handleSendOtp)}
						>
							<InputGroup>
								<InputGroupInput
									placeholder="your.email@example.com"
									type="email"
									{...emailForm.register("email")}
								/>
								<InputGroupAddon align="inline-start">
									<IconAt />
								</InputGroupAddon>
							</InputGroup>
							{emailForm.formState.errors.email?.message && (
								<p className="text-destructive text-sm">{emailForm.formState.errors.email.message}</p>
							)}
							<Button
								className="w-full"
								size="sm"
								type="submit"
								disabled={emailForm.formState.isSubmitting}
							>
								{emailForm.formState.isSubmitting ? "Sending…" : "Continue With Email"}
							</Button>
						</form>
					) : (
						<form
							className="space-y-2"
							onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
						>
							<InputGroup>
								<InputGroupInput
									placeholder="6-digit code"
									type="text"
									inputMode="numeric"
									maxLength={6}
									autoFocus
									{...otpForm.register("otp", {
										onChange: (e) => {
											e.target.value = e.target.value.replace(/\D/g, "");
										},
									})}
								/>
								<InputGroupAddon align="inline-start">
									<IconHash />
								</InputGroupAddon>
							</InputGroup>
							{otpForm.formState.errors.otp?.message && (
								<p className="text-destructive text-sm">{otpForm.formState.errors.otp.message}</p>
							)}
							<Button
								className="w-full"
								size="sm"
								type="submit"
								disabled={otpForm.formState.isSubmitting}
							>
								{otpForm.formState.isSubmitting ? "Verifying…" : "Verify Code"}
							</Button>
							<button
								type="button"
								className="text-muted-foreground hover:text-primary w-full text-center text-sm"
								onClick={() => {
									setStep("email");
									otpForm.reset();
								}}
							>
								Use a different email
							</button>
						</form>
					)}

					{step === "email" && (
						<>
							<AuthDivider>OR CONTINUE WITH</AuthDivider>
							<div className="space-y-2">
								<Button
									className="w-full"
									type="button"
									variant="outline"
									onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
								>
									<GoogleIcon data-icon="inline-start" />
									Google
								</Button>
								<Button
									className="w-full"
									type="button"
									variant="outline"
									onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/" })}
								>
									<GithubIcon data-icon="inline-start" />
									GitHub
								</Button>
							</div>
						</>
					)}
				</div>

				<p className="text-muted-foreground text-center text-sm">
					This site is protected by reCAPTCHA and the Google{" "}
					<a
						className="hover:text-primary underline underline-offset-4"
						href="#"
					>
						Privacy Policy
					</a>{" "}
					and{" "}
					<a
						className="hover:text-primary underline underline-offset-4"
						href="#"
					>
						Terms of Service
					</a>{" "}
					apply.
				</p>
			</div>
		</div>
	);
}

export function AuthDivider({ children, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className="relative flex w-full items-center"
			{...props}
		>
			<div className="w-full border-t" />
			<div className="text-muted-foreground flex w-max justify-center px-2 text-xs text-nowrap">{children}</div>
			<div className="w-full border-t" />
		</div>
	);
}

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
	<svg
		fill="currentColor"
		viewBox="0 0 24 24"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const GithubIcon = (props: React.ComponentProps<"svg">) => (
	<svg
		fill="currentColor"
		viewBox="0 0 1024 1024"
		{...props}
	>
		<path
			clipRule="evenodd"
			d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
			fill="currentColor"
			fillRule="evenodd"
			transform="scale(64)"
		/>
	</svg>
);
