-- =====================================================
-- Allow anyone to increment view_count for car_listings
-- =====================================================
-- This uses a database function with SECURITY DEFINER
-- to bypass RLS restrictions for view count increments
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.increment_listing_view_count(UUID);

-- Create function to increment view count atomically
-- SECURITY DEFINER allows this to bypass RLS policies
CREATE OR REPLACE FUNCTION public.increment_listing_view_count(listing_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
  rows_updated INTEGER;
BEGIN
  UPDATE car_listings
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = listing_id
  RETURNING view_count INTO new_count;
  
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  -- If no rows were updated, the listing doesn't exist or there's an issue
  -- Return the current count (0) to indicate failure
  IF rows_updated = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN COALESCE(new_count, 0);
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.increment_listing_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_listing_view_count(UUID) TO anon;
