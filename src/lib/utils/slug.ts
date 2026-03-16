/**
 * Generate a URL-safe slug from a string (e.g. listing title).
 * Replaces spaces and non-alphanumeric chars with hyphens, lowercases, collapses multiple hyphens.
 */
export function slugify(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") || "listing";
}

/**
 * Generate a unique slug for a car listing: slugify(title) + '-' + shortId.
 * shortId should be the first 8 characters of the listing UUID to guarantee uniqueness.
 */
export function generateListingSlug(title: string, listingId: string): string {
  const base = slugify(title);
  const shortId = (listingId || "").replace(/-/g, "").slice(0, 8);
  return shortId ? `${base}-${shortId}` : base;
}

/** Check if a string looks like a UUID (with or without hyphens). */
export function isUuid(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const hex = value.replace(/-/g, "");
  return hex.length === 32 && /^[0-9a-fA-F]{32}$/.test(hex);
}
