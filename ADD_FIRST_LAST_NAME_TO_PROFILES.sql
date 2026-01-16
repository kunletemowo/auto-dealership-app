-- =====================================================
-- Add first_name and last_name fields to profiles table
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Add first_name and last_name columns to profiles table (nullable first)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Backfill existing profiles to extract first_name and last_name from display_name
-- This handles existing users who don't have these fields set
-- Note: We'll get email from auth.users if needed, but for now use display_name or fallback
UPDATE profiles
SET 
  first_name = COALESCE(
    NULLIF(TRIM(split_part(COALESCE(display_name, ''), ' ', 1)), ''),
    'User'
  ),
  last_name = COALESCE(
    NULLIF(TRIM(
      CASE 
        WHEN position(' ' in COALESCE(display_name, '')) > 0 
        THEN substring(display_name from position(' ' in display_name) + 1)
        ELSE ''
      END
    ), ''),
    ''
  )
WHERE first_name IS NULL OR last_name IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE profiles 
ALTER COLUMN first_name SET NOT NULL;

ALTER TABLE profiles 
ALTER COLUMN last_name SET NOT NULL;

-- =====================================================
-- Update handle_new_user trigger to include first_name and last_name
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Migration complete!
-- =====================================================
