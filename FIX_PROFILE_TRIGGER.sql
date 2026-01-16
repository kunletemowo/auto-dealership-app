-- =====================================================
-- Fix: Update handle_new_user trigger to include city field
-- =====================================================
-- This fixes the "Database error saving new user" issue
-- The city field is now required (NOT NULL), so the trigger must provide it
-- =====================================================

-- Update the trigger function to include city field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'Unknown'  -- Default city value since city is required (NOT NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The trigger itself doesn't need to be recreated, just the function
-- The trigger 'on_auth_user_created' will automatically use the updated function
