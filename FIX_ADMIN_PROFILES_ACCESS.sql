-- =====================================================
-- Fix: Allow Admins to Access All Profiles
-- =====================================================
-- This ensures admins can view all profiles in the admin panel
-- =====================================================

-- =====================================================
-- IMPORTANT: Run FIX_USER_ROLES_RLS_RECURSION.sql FIRST!
-- =====================================================
-- This script requires the is_admin_user() function from
-- FIX_USER_ROLES_RLS_RECURSION.sql to avoid infinite recursion
-- =====================================================

-- Drop existing policies that might block admin access
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create policy to allow admins to view all profiles
-- Uses is_admin_user() function to avoid recursion
-- NOTE: We only use is_admin_user() to avoid querying profiles within profiles policy
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin_user());  -- Only use function, no recursive profile queries

-- Also allow admins to update profiles (for role management)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin_user())  -- Only use function, no recursive profile queries
  WITH CHECK (is_admin_user());  -- Only use function, no recursive profile queries

-- =====================================================
-- Verification
-- =====================================================
-- After running this, admins should be able to:
-- 1. View all profiles in the admin panel
-- 2. Update user roles and permissions
-- 3. Search for any user
-- =====================================================
