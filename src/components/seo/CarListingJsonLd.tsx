const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

interface CarListingJsonLdProps {
  id: string;
  slug?: string | null;
  title: string;
  description: string;
  price: number;
  currency: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  imageUrls: string[];
}

export function CarListingJsonLd({
  id,
  slug,
  title,
  description,
  price,
  currency,
  make,
  model,
  year,
  mileage,
  condition,
  imageUrls,
}: CarListingJsonLdProps) {
  const url = `${siteUrl}/cars/${slug || id}`;
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description?.slice(0, 500) || title,
    url,
    image: imageUrls.length > 0 ? imageUrls : undefined,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency || "CAD",
      availability: "https://schema.org/InStock",
      url,
    },
    ...(make && { brand: { "@type": "Brand", name: make } }),
    ...(year && { model: model || undefined }),
    vehicleModelDate: year || undefined,
    mileageFromOdometer:
      mileage != null
        ? { "@type": "QuantitativeValue", value: mileage, unitCode: "KMT" }
        : undefined,
    vehicleCondition: condition === "new" ? "NewCondition" : "UsedCondition",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Cars", item: `${siteUrl}/cars` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
