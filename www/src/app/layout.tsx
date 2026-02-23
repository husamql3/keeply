import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sileo";

import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Keeply",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(dmSans.variable, "bg-zinc-950", "antialiased", "dark")}>
				{children}
				<Toaster
					position="top-center"
					theme="dark"
				/>
				<Analytics />
			</body>
		</html>
	);
}
