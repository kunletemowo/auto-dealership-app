-- =====================================================
-- Fix car_listings that still have NULL slug
-- =====================================================
-- Run this in Supabase SQL Editor if you still see UUID URLs.
-- This updates any row where slug IS NULL (same formula as backfill).
-- =====================================================

-- 1. Check how many rows have null slug (optional)
-- SELECT count(*) FROM car_listings WHERE slug IS NULL;

-- 2. Backfill any rows with null slug
UPDATE car_listings
SET slug = (
  trim(both '-' from regexp_replace(lower(regexp_replace( coalesce(title, 'listing'), '[^a-z0-9]+', '-', 'g')), '-+', '-', 'g'))
  || '-'
  || left(replace(id::text, '-', ''), 8)
)
WHERE slug IS NULL AND id IS NOT NULL;

-- 3. Verify: list slugs for active listings (including the one you were testing)
-- SELECT id, title, slug FROM car_listings WHERE is_active = true ORDER BY created_at DESC LIMIT 10;
