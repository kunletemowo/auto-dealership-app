-- =====================================================
-- Fix: Set explicit search_path for all functions
-- =====================================================
-- This fixes all Supabase security warnings:
-- - "Function public.handle_new_user has a role mutable search_path"
-- - "Function public.update_updated_at_column has a role mutable search_path"
-- 
-- Security Issue: Functions without explicit search_path can be vulnerable
-- to search_path manipulation attacks where malicious users can execute
-- code from unintended schemas.
-- 
-- Solution: Explicitly set search_path to only use 'public' and 'pg_temp'
-- =====================================================

-- Fix 1: Update handle_new_user function with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    display_name, 
    first_name, 
    last_name,
    city
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1), ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'Unknown'  -- Default city value since city is required (NOT NULL)
  );
  RETURN NEW;
END;
$$;

-- Fix 2: Update update_updated_at_column function with explicit search_path
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
-- 1. Check both function definitions:
--    SELECT routine_name, routine_definition, external_name as search_path 
--    FROM information_schema.routines 
--    WHERE routine_name IN ('handle_new_user', 'update_updated_at_column');
--
-- 2. The Supabase security warnings should disappear from the dashboard
-- 3. Test functionality:
--    - Create a new user account (tests handle_new_user)
--    - Update a profile record (tests update_updated_at_column on profiles)
--    - Update a car_listing record (tests update_updated_at_column on car_listings)
-- =====================================================
-- Fix complete! Both functions are now secure.
-- =====================================================
