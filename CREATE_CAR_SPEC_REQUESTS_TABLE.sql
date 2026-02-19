-- =====================================================
-- Create car_spec_requests table
-- =====================================================
-- This table stores customer requests for cars with specific specifications
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Create car_spec_requests table
CREATE TABLE IF NOT EXISTS car_spec_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  -- Car Specifications
  make TEXT,
  model TEXT,
  year_min INTEGER,
  year_max INTEGER,
  mileage_max INTEGER,
  price_min NUMERIC(10, 2),
  price_max NUMERIC(10, 2),
  transmission TEXT CHECK (transmission IN ('automatic', 'manual', 'any')),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'other', 'any')),
  condition_type TEXT CHECK (condition_type IN ('new', 'used', 'any')),
  color TEXT,
  -- Additional Requirements
  additional_requirements TEXT,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'fulfilled', 'cancelled')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_car_spec_requests_user_id ON car_spec_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_car_spec_requests_status ON car_spec_requests(status);
CREATE INDEX IF NOT EXISTS idx_car_spec_requests_created_at ON car_spec_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_car_spec_requests_email ON car_spec_requests(email);

-- Enable Row Level Security
ALTER TABLE car_spec_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- IMPORTANT: Use single INSERT policy - multiple INSERT policies can cause conflicts

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

-- 3. SELECT: Admins can view all requests
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

-- 4. UPDATE: Users can update their own requests
CREATE POLICY "Users can update own spec requests"
  ON car_spec_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. UPDATE: Admins can update all requests
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

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_car_spec_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_car_spec_requests_updated_at
  BEFORE UPDATE ON car_spec_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_car_spec_requests_updated_at();

-- =====================================================
-- Verification
-- =====================================================
-- After running this migration, verify:
-- 1. Table car_spec_requests exists
-- 2. Indexes are created
-- 3. RLS policies are active
-- 4. Test inserting a request as a user
-- 5. Test viewing requests as admin
-- =====================================================
