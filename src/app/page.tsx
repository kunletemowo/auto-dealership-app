import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";
import { FeaturedListings } from "@/components/landing/FeaturedListings";
import { unstable_noStore } from "next/cache";

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
