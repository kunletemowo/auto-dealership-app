-- =====================================================
-- Add Email Column to Profiles Table
-- =====================================================
-- This allows searching users by email in the admin panel
-- =====================================================

-- Add email column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for faster email searches
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update existing profiles with emails from auth.users
-- Note: This requires the function to have access to auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile email when auth.users email changes
  UPDATE profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Create trigger to sync email from auth.users to profiles
DROP TRIGGER IF EXISTS sync_email_to_profiles ON auth.users;
CREATE TRIGGER sync_email_to_profiles
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();

-- Manually sync existing emails (run this once)
-- Note: This might require service role or manual update
-- UPDATE profiles p
-- SET email = au.email
-- FROM auth.users au
-- WHERE p.id = au.id AND p.email IS NULL;

-- =====================================================
-- After running this:
-- 1. New users will automatically have email synced
-- 2. You can search by email in admin panel
-- 3. For existing users, you may need to manually update emails
--    or use a service role to sync them
-- =====================================================
