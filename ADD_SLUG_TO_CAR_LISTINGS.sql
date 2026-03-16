-- =====================================================
-- Add slug column to car_listings for human-readable URLs
-- =====================================================
-- Run this in Supabase SQL Editor. After running, the app
-- will use slugs like /cars/2022-mazda-cx5-mississauga-a1b2c3d4
-- =====================================================

-- 1. Add slug column (nullable first for backfill)
ALTER TABLE car_listings
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Create unique index (allows NULLs; duplicate NULLs are allowed in PostgreSQL)
CREATE UNIQUE INDEX IF NOT EXISTS car_listings_slug_key ON car_listings (slug) WHERE slug IS NOT NULL;

-- 3. Backfill existing rows: slug = slugify(title) + '-' + first 8 hex chars of id (no hyphens)
-- IMPORTANT: Lower the title FIRST so uppercase letters are not treated as non-alphanumeric by [^a-z0-9]
UPDATE car_listings
SET slug = (
  trim(both '-' from regexp_replace(regexp_replace(lower(coalesce(title, 'listing')), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g'))
  || '-'
  || left(replace(id::text, '-', ''), 8)
)
WHERE slug IS NULL AND id IS NOT NULL;

-- 4. Optional: set NOT NULL so new rows must have slug (app will always set it)
-- ALTER TABLE car_listings ALTER COLUMN slug SET NOT NULL;

-- 5. Verification: list a few slugs
-- SELECT id, title, slug FROM car_listings WHERE is_active = true LIMIT 5;
