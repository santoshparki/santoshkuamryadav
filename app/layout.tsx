import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { getPublicHero, getPublicSiteSettings } from "@/lib/supabase/public-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, hero] = await Promise.all([getPublicSiteSettings(), getPublicHero()]);
  const siteTitle = settings?.seoTitle || settings?.siteTitle || "Santosh Kumar Yadav | Portfolio";
  const description =
    settings?.seoDescription ||
    hero?.subheadline ||
    "Portfolio of Santosh Kumar Yadav, Electrical and Electronics Engineer.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const imageUrl = hero?.heroImageUrl || hero?.backgroundImageUrl || settings?.logoUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: siteTitle,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: siteTitle,
      description,
      type: "website",
      url: "/",
      images: imageUrl ? [{ url: imageUrl, alt: siteTitle }] : undefined,
    },
    twitter: { card: "summary_large_image", title: siteTitle, description, images: imageUrl ? [imageUrl] : undefined },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
