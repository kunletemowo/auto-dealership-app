-- =====================================================
-- Auto Sales Platform - Supabase Database Setup
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- Step 1: Run the entire script to create all tables, types, and policies
-- Step 2: Set up Storage bucket (see instructions below)
-- =====================================================

-- =====================================================
-- 1. CREATE ENUMS
-- =====================================================

-- Transmission type enum
DO $$ BEGIN
  CREATE TYPE transmission_type AS ENUM ('automatic', 'manual');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Fuel type enum
DO $$ BEGIN
  CREATE TYPE fuel_type AS ENUM ('gasoline', 'diesel', 'electric', 'hybrid', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Condition type enum
DO $$ BEGIN
  CREATE TYPE condition_type AS ENUM ('new', 'used');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. CREATE PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  location TEXT,
  phone TEXT,
  account_type TEXT DEFAULT 'individual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE CAR_LISTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS car_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  transmission transmission_type NOT NULL,
  fuel_type fuel_type NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  location_city TEXT NOT NULL,
  location_region TEXT NOT NULL,
  location_country TEXT NOT NULL,
  condition condition_type NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE CAR_IMAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS car_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES car_listings(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_car_listings_user_id ON car_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_car_listings_is_active ON car_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_car_listings_make ON car_listings(make);
CREATE INDEX IF NOT EXISTS idx_car_listings_price ON car_listings(price);
CREATE INDEX IF NOT EXISTS idx_car_listings_year ON car_listings(year);
CREATE INDEX IF NOT EXISTS idx_car_listings_created_at ON car_listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_car_images_listing_id ON car_images(listing_id);

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. DROP EXISTING POLICIES (if re-running script)
-- =====================================================

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Anyone can view active listings" ON car_listings;
DROP POLICY IF EXISTS "Users can create listings" ON car_listings;
DROP POLICY IF EXISTS "Users can update own listings" ON car_listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON car_listings;

DROP POLICY IF EXISTS "Anyone can view images for active listings" ON car_images;
DROP POLICY IF EXISTS "Users can insert images for own listings" ON car_images;
DROP POLICY IF EXISTS "Users can update images for own listings" ON car_images;
DROP POLICY IF EXISTS "Users can delete images for own listings" ON car_images;

-- =====================================================
-- 8. CREATE RLS POLICIES FOR PROFILES
-- =====================================================

-- Anyone can view profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 9. CREATE RLS POLICIES FOR CAR_LISTINGS
-- =====================================================

-- Anyone can view active listings, users can view their own (active or inactive)
CREATE POLICY "Anyone can view active listings"
  ON car_listings FOR SELECT
  USING (is_active = true OR auth.uid() = user_id);

-- Authenticated users can create listings
CREATE POLICY "Users can create listings"
  ON car_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
  ON car_listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings"
  ON car_listings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 10. CREATE RLS POLICIES FOR CAR_IMAGES
-- =====================================================

-- Anyone can view images for active listings, users can view images for their own listings
CREATE POLICY "Anyone can view images for active listings"
  ON car_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND (car_listings.is_active = true OR car_listings.user_id = auth.uid())
    )
  );

-- Users can insert images for their own listings
CREATE POLICY "Users can insert images for own listings"
  ON car_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND car_listings.user_id = auth.uid()
    )
  );

-- Users can update images for their own listings
CREATE POLICY "Users can update images for own listings"
  ON car_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND car_listings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND car_listings.user_id = auth.uid()
    )
  );

-- Users can delete images for their own listings
CREATE POLICY "Users can delete images for own listings"
  ON car_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND car_listings.user_id = auth.uid()
    )
  );

-- =====================================================
-- 11. CREATE FUNCTION TO AUTO-UPDATE UPDATED_AT TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add check constraint for account_type
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_account_type_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_account_type_check 
CHECK (account_type IN ('individual', 'business'));

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_car_listings_updated_at ON car_listings;
CREATE TRIGGER update_car_listings_updated_at
  BEFORE UPDATE ON car_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. CREATE FUNCTION TO AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a bucket named 'car-images'
-- 3. Set it to Public
-- 4. Run the storage policies SQL (see below)
-- =====================================================
