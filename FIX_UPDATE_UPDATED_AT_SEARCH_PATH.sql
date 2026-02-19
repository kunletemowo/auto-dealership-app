-- =====================================================
-- Fix: Set explicit search_path for update_updated_at_column function
-- =====================================================
-- This fixes the Supabase security warning:
-- "Function public.update_updated_at_column has a role mutable search_path"
-- 
-- Security Issue: Functions without explicit search_path can be vulnerable
-- to search_path manipulation attacks where malicious users can execute
-- code from unintended schemas.
-- 
-- Solution: Explicitly set search_path to only use 'public' and 'pg_temp'
-- =====================================================

-- Update the update_updated_at_column function with explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- Verification Steps
-- =====================================================
-- After running this migration:
-- 1. Check the function definition:
--    SELECT routine_name, routine_definition, external_name as search_path 
--    FROM information_schema.routines 
--    WHERE routine_name = 'update_updated_at_column';
--
-- 2. The Supabase security warning should disappear from the dashboard
-- 3. Test that the updated_at triggers still work:
--    - Update a profile record and verify updated_at changes
--    - Update a car_listing record and verify updated_at changes
-- =====================================================
-- Fix complete!
-- =====================================================
