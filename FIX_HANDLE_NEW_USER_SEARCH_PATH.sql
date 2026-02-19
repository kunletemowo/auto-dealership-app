-- =====================================================
-- Fix: Set explicit search_path for handle_new_user function
-- =====================================================
-- This fixes the Supabase security warning:
-- "Function public.handle_new_user has a role mutable search_path"
-- 
-- Security Issue: Functions without explicit search_path can be vulnerable
-- to search_path manipulation attacks where malicious users can execute
-- code from unintended schemas.
-- 
-- Solution: Explicitly set search_path to only use 'public' and 'pg_temp'
-- =====================================================

-- Update the handle_new_user function with explicit search_path
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

-- =====================================================
-- Verification Steps
-- =====================================================
-- After running this migration:
-- 1. Check the function definition:
--    SELECT routine_name, routine_definition, search_path 
--    FROM information_schema.routines 
--    WHERE routine_name = 'handle_new_user';
--
-- 2. The Supabase security warning should disappear from the dashboard
-- 3. Test that new user signups still work correctly
-- =====================================================
-- Fix complete!
-- =====================================================
