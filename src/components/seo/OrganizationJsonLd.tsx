const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export function OrganizationJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kuldae Autos",
    url: siteUrl,
    logo: `${siteUrl}/kuldae-autos-logo.png`,
    description:
      "Kuldae Autos connects car buyers and sellers across Canada. Browse listings or list your car for free.",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kuldae Autos",
    url: siteUrl,
    description:
      "The best platform to buy and sell cars in Canada. Browse thousands of listings or list your car for free.",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/cars?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ ...organization, "@id": `${siteUrl}/#organization` }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
