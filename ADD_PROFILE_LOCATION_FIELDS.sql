-- =====================================================
-- Split profiles.location into address / city / province / postal_code
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Backfill best-effort from existing location (if present)
-- Note: this is a simple backfill; you can refine it manually if needed.
UPDATE profiles
SET city = COALESCE(city, NULLIF(TRIM(location), ''))
WHERE (city IS NULL OR city = '')
  AND location IS NOT NULL
  AND TRIM(location) <> '';

-- Make city field required (NOT NULL)
-- First, set a default for any NULL city values
UPDATE profiles
SET city = 'Unknown'
WHERE city IS NULL;

-- Now add the NOT NULL constraint
ALTER TABLE profiles
ALTER COLUMN city SET NOT NULL;

