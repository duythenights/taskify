import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: [
        {
            url: "/logo.svg",
            href: "/logo.svg",
        },
    ],
    verification: {
        google: "9PumzXW11nmoseJ0kYOZTAwTllq43zy7M_7Pks5klIw",
        other: {
            "google-site-verification":
                "9PumzXW11nmoseJ0kYOZTAwTllq43zy7M_7Pks5klIw",
        },
    },
    other: {
        name: "google-site-verification",
        content: "ewawsLX9_9TZyMFjdeqxxGSWXpYSk6vUaAgtwwqakFE",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
