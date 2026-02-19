-- =====================================================
-- Fix RLS policies for car_spec_requests table
-- =====================================================
-- Run this in Supabase SQL Editor to fix the 
-- "new row violates row-level security policy" error
-- =====================================================

-- Drop ALL existing policies on car_spec_requests
DROP POLICY IF EXISTS "Users can view own spec requests" ON car_spec_requests;
DROP POLICY IF EXISTS "Users can insert own spec requests" ON car_spec_requests;
DROP POLICY IF EXISTS "Users can update own spec requests" ON car_spec_requests;
DROP POLICY IF EXISTS "Admins can view all spec requests" ON car_spec_requests;
DROP POLICY IF EXISTS "Admins can update all spec requests" ON car_spec_requests;
DROP POLICY IF EXISTS "Anyone can insert spec requests" ON car_spec_requests;

-- Recreate policies with correct logic

-- 1. INSERT: Allow anyone (authenticated or anonymous) to create spec requests
CREATE POLICY "Allow insert spec requests"
  ON car_spec_requests
  FOR INSERT
  WITH CHECK (true);

-- 2. SELECT: Users can view their own requests
CREATE POLICY "Users can view own spec requests"
  ON car_spec_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. SELECT: Allow anonymous to view nothing (they don't have own requests)
-- Already covered - authenticated users see own, anon see nothing from this policy

-- 4. SELECT: Admins can view all requests
CREATE POLICY "Admins can view all spec requests"
  ON car_spec_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 5. UPDATE: Users can update their own requests
CREATE POLICY "Users can update own spec requests"
  ON car_spec_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. UPDATE: Admins can update any request
CREATE POLICY "Admins can update all spec requests"
  ON car_spec_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (true);
