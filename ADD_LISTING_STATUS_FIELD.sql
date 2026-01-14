-- =====================================================
-- Add status field to car_listings table
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Add status column to car_listings table
-- Status values: 'active', 'inactive', 'sold', 'unavailable'
ALTER TABLE car_listings 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add check constraint to ensure only valid status values
ALTER TABLE car_listings 
DROP CONSTRAINT IF EXISTS car_listings_status_check;

ALTER TABLE car_listings 
ADD CONSTRAINT car_listings_status_check 
CHECK (status IN ('active', 'inactive', 'sold', 'unavailable'));

-- Create index for status field
CREATE INDEX IF NOT EXISTS idx_car_listings_status ON car_listings(status);

-- Update existing records: set status based on is_active
-- Active listings -> 'active', inactive listings -> 'inactive'
UPDATE car_listings 
SET status = CASE 
  WHEN is_active = true THEN 'active'
  ELSE 'inactive'
END
WHERE status IS NULL;

-- Set default status for new records
ALTER TABLE car_listings 
ALTER COLUMN status SET DEFAULT 'active';
