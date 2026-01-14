-- =====================================================
-- Add postal_code field to car_listings table
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to add the postal_code field
-- =====================================================

-- Add postal_code column to car_listings table (optional field)
ALTER TABLE car_listings 
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Add index for postal code searches (optional, but recommended for performance)
CREATE INDEX IF NOT EXISTS idx_car_listings_postal_code ON car_listings(postal_code);

-- Add index for location_city and location_region for better search performance
CREATE INDEX IF NOT EXISTS idx_car_listings_location_city ON car_listings(location_city);
CREATE INDEX IF NOT EXISTS idx_car_listings_location_region ON car_listings(location_region);
