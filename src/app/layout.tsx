import { configuration } from "@/constants/configs";
import { NextAuthProvider } from "@/lib/next-auth";
import { cn } from "@/utils/common";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import { PHProvider, PostHogPageview } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.className,
          )}
        >
          <NextAuthProvider>{children}</NextAuthProvider>
        </body>
      </PHProvider>
    </html>
  );
}

export const metadata = {
  title: configuration.site.name,
  description: configuration.site.description,
  metadataBase: new URL(configuration.site.siteUrl!),
  openGraph: {
    url: configuration.site.siteUrl,
    siteName: configuration.site.siteName,
    description: configuration.site.description,
  },
  twitter: {
    card: "/public/assets/octolane-hero.svg",
    title: configuration.site.name,
    description: configuration.site.description,
    creator: configuration.site.twitterHandle,
  },
  icons: {
    icon: "/assets/favicon/favicon.ico",
    shortcut: "/shortcut-icon.png",
    apple: "/assets/favicon/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
};
