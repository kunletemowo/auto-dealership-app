-- =====================================================
-- Add latitude and longitude fields to car_listings table
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to add coordinates for distance calculations
-- =====================================================

-- Add latitude and longitude columns to car_listings table (optional fields)
ALTER TABLE car_listings 
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7);

ALTER TABLE car_listings 
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7);

-- Add indexes for coordinate-based searches
CREATE INDEX IF NOT EXISTS idx_car_listings_coordinates ON car_listings(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Note: To enable distance calculations, you may need to enable the PostGIS extension:
-- CREATE EXTENSION IF NOT EXISTS postgis;
-- However, for basic distance calculations, we can use the Haversine formula in the application layer.
