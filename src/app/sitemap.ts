import type { MetadataRoute } from "next";
import { getActiveCarListingIds } from "@/app/actions/cars";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  { url: `${baseUrl}/cars`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  { url: `${baseUrl}/cars/new`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${baseUrl}/car-value-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${baseUrl}/protection-plans`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${baseUrl}/order-spec`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getActiveCarListingIds();
  const carEntries: MetadataRoute.Sitemap = listings.map(({ id, slug }) => ({
    url: `${baseUrl}/cars/${slug || id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...carEntries];
}
