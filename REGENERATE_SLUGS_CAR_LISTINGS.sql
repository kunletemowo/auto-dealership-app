-- =====================================================
-- Regenerate slugs for all car_listings (fixes wrong slugs)
-- =====================================================
-- Use this when slugs were generated with the wrong formula and
-- the first letter of each word was omitted (e.g. oyota-amry instead of toyota-camry).
-- Cause: title was not lowercased before replacing [^a-z0-9], so uppercase letters
-- were replaced with hyphens and then trimmed away.
-- =====================================================

-- Regenerate slug for every row: lower(title) first, then replace non-alphanumeric, then add shortId
UPDATE car_listings
SET slug = (
  trim(both '-' from regexp_replace(regexp_replace(lower(coalesce(title, 'listing')), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g'))
  || '-'
  || left(replace(id::text, '-', ''), 8)
)
WHERE id IS NOT NULL;

-- Verify: check a few slugs
-- SELECT id, title, slug FROM car_listings WHERE is_active = true ORDER BY updated_at DESC LIMIT 10;
