-- =====================================================
-- Fix: Ensure Users Can Access Their Own Profiles
-- =====================================================
-- This ensures users can view and update their own profiles
-- =====================================================

-- Drop existing policies that might block access
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policy to allow anyone to view profiles (for public listings)
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- Verification
-- =====================================================
-- After running this, users should be able to:
-- 1. View all profiles (for public listings)
-- 2. View their own profile
-- 3. Update their own profile
-- 4. Create their own profile if it doesn't exist
-- =====================================================

-- Test query (run as authenticated user):
-- SELECT * FROM profiles WHERE id = auth.uid();
-- =====================================================
