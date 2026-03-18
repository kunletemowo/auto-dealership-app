import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { AuthHashHandler } from "@/components/auth/AuthHashHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kuldae Autos – Buy and Sell Cars in Canada",
    template: "%s | Kuldae Autos",
  },
  description:
    "The best platform to buy and sell cars in Canada. Browse thousands of listings or list your car for free. Connect with buyers and sellers.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Kuldae Autos",
    title: "Kuldae Autos – Buy and Sell Cars in Canada",
    description:
      "The best platform to buy and sell cars in Canada. Browse listings or list your car for free.",
    images: [{ url: "/kuldae-autos-logo.png", width: 1200, height: 630, alt: "Kuldae Autos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuldae Autos – Buy and Sell Cars in Canada",
    description:
      "The best platform to buy and sell cars in Canada. Browse listings or list your car for free.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrganizationJsonLd />
        <ToastProvider>
          <AuthHashHandler />
          <Header />
          <main className="min-h-screen">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
