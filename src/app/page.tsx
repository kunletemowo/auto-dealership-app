import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";
import { FeaturedListings } from "@/components/landing/FeaturedListings";
import { unstable_noStore } from "next/cache";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  title: "Buy and Sell Cars in Canada",
  description:
    "Kuldae Autos connects car buyers and sellers across Canada. Browse thousands of vehicle listings, list your car for free, and find your next ride.",
  alternates: { canonical: siteUrl },
};

export default function Home() {
  // Mark this page as dynamic since FeaturedListings uses cookies
  unstable_noStore();
  
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <FeaturedListings />
      <CTASection />
    </div>
  );
}
