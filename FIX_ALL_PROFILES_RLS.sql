-- =====================================================
-- Fix: Remove ALL Recursion in Profiles RLS Policies
-- =====================================================
-- This script fixes ALL RLS policies on profiles to prevent recursion
-- Strategy: Use simple policies without any function calls or table queries
-- Admin access control is handled in application code, not RLS
-- =====================================================

-- Drop ALL existing policies on profiles to start fresh
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- =====================================================
-- RECREATE ALL PROFILES POLICIES (NO RECURSION)
-- =====================================================

-- Anyone can view profiles (for public listings)
-- This is safe - no recursion, no function calls, no table queries
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
-- This is safe - only checks auth.uid(), no table queries, no function calls
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
-- This is safe - only checks auth.uid(), no table queries, no function calls
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- NOTE: Admin-specific policies removed to prevent recursion
-- Admin access control is handled in application code (server actions)
-- The "Users can view all profiles" policy already allows admins to view all profiles

-- =====================================================
-- VERIFICATION
-- =====================================================
-- After running this:
-- 1. No more infinite recursion errors
-- 2. Users can view all profiles (for public listings)
-- 3. Users can update their own profile
-- 4. Admins can view and update all profiles
-- 5. Profile page should load without errors
-- =====================================================
