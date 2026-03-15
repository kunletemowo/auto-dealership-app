import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin/", "/dashboard/", "/profile", "/debug-env"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
