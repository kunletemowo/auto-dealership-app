-- =====================================================
-- Fix: Remove Infinite Recursion in user_roles RLS Policies
-- =====================================================
-- The issue: RLS policies for user_roles were checking admin status
-- by querying user_roles itself, causing infinite recursion.
-- Solution: Use a SECURITY DEFINER function to check admin status
-- =====================================================

-- Drop existing policies that cause recursion
-- Drop all policies on user_roles
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can create user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;

-- Drop all policies on user_permissions
DROP POLICY IF EXISTS "Admins can view all permissions" ON user_permissions;
DROP POLICY IF EXISTS "Admins can grant permissions" ON user_permissions;
DROP POLICY IF EXISTS "Admins can revoke permissions" ON user_permissions;
DROP POLICY IF EXISTS "Users can view own permissions" ON user_permissions;

-- Create a SECURITY DEFINER function to check if current user is admin
-- This function bypasses RLS, preventing infinite recursion
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role_val user_role;
BEGIN
  -- Check user_roles table (bypasses RLS due to SECURITY DEFINER)
  SELECT role INTO user_role_val
  FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Return true if user is admin
  RETURN user_role_val = 'admin';
END;
$$;

-- Create a SECURITY DEFINER function to check if current user is admin or moderator
CREATE OR REPLACE FUNCTION is_admin_or_moderator()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role_val user_role;
BEGIN
  -- Check user_roles table (bypasses RLS due to SECURITY DEFINER)
  SELECT role INTO user_role_val
  FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Return true if user is admin or moderator
  RETURN user_role_val IN ('admin', 'moderator');
END;
$$;

-- =====================================================
-- RECREATE RLS POLICIES FOR USER_ROLES (NO RECURSION)
-- =====================================================

-- Admins can view all roles (uses function, no recursion)
CREATE POLICY "Admins can view all user roles"
  ON user_roles FOR SELECT
  USING (is_admin_user());

-- Admins can insert roles
CREATE POLICY "Admins can create user roles"
  ON user_roles FOR INSERT
  WITH CHECK (is_admin_user());

-- Admins can update roles
CREATE POLICY "Admins can update user roles"
  ON user_roles FOR UPDATE
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Admins can delete roles
CREATE POLICY "Admins can delete user roles"
  ON user_roles FOR DELETE
  USING (is_admin_user());

-- Users can view their own role
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- =====================================================
-- RECREATE RLS POLICIES FOR USER_PERMISSIONS (NO RECURSION)
-- =====================================================

-- Admins can view all permissions
CREATE POLICY "Admins can view all permissions"
  ON user_permissions FOR SELECT
  USING (is_admin_user());

-- Admins can grant permissions
CREATE POLICY "Admins can grant permissions"
  ON user_permissions FOR INSERT
  WITH CHECK (is_admin_user());

-- Admins can revoke permissions
CREATE POLICY "Admins can revoke permissions"
  ON user_permissions FOR DELETE
  USING (is_admin_user());

-- Users can view their own permissions
CREATE POLICY "Users can view own permissions"
  ON user_permissions FOR SELECT
  USING (user_id = auth.uid());

-- =====================================================
-- VERIFICATION
-- =====================================================
-- After running this:
-- 1. No more infinite recursion errors
-- 2. Admins can manage all roles and permissions
-- 3. Users can view their own roles and permissions
-- 4. Profile page should load without errors
-- =====================================================
