import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";
import { FeaturedListings } from "@/components/landing/FeaturedListings";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <FeaturedListings />
      <CTASection />
    </div>
  );
}
