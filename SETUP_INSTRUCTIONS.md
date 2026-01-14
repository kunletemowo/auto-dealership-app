# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

## Installation Steps

### 1. Install Dependencies

```bash
npm install clsx tailwind-merge zod @supabase/ssr
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 3. Supabase Setup

#### Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  location TEXT,
  phone TEXT,
  account_type TEXT DEFAULT 'individual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create car_listings table
CREATE TYPE transmission_type AS ENUM ('automatic', 'manual');
CREATE TYPE fuel_type AS ENUM ('gasoline', 'diesel', 'electric', 'hybrid', 'other');
CREATE TYPE condition_type AS ENUM ('new', 'used');

CREATE TABLE car_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Create car_images table
CREATE TABLE car_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES car_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Car listings policies
CREATE POLICY "Anyone can view active listings"
  ON car_listings FOR SELECT
  USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Users can create listings"
  ON car_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON car_listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON car_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Car images policies
CREATE POLICY "Anyone can view images for active listings"
  ON car_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND (car_listings.is_active = true OR car_listings.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert images for own listings"
  ON car_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND car_listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images for own listings"
  ON car_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM car_listings
      WHERE car_listings.id = car_images.listing_id
      AND car_listings.user_id = auth.uid()
    )
  );
```

#### Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `car-images`
3. Set it to Public (for viewing images)
4. Add RLS policy:

```sql
CREATE POLICY "Anyone can view car images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own car images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'car-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Project Structure Overview

See `FILE_STRUCTURE.md` for detailed file structure documentation.

## Next Steps for Implementation

1. **Implement Authentication**
   - Complete the auth logic in `LoginForm.tsx` and `RegisterForm.tsx`
   - Add user session management
   - Create protected route middleware

2. **Implement Car Listings**
   - Complete the car listing form in `/cars/new`
   - Add image upload functionality
   - Implement data fetching in `/cars` page
   - Complete car detail page

3. **Add Server Actions**
   - Create server actions for CRUD operations
   - Implement search and filtering logic
   - Add pagination

4. **Profile Management**
   - Complete profile page
   - Add profile update functionality

5. **Dashboard**
   - Implement "My Listings" page
   - Add edit/delete functionality

## Development Tips

- Use TypeScript strictly - all components are typed
- Follow the component structure - components are organized by feature
- Use the form components (`Input`, `Button`, etc.) for consistency
- Server components by default, use `"use client"` only when needed
- Use the Supabase client helpers in `lib/supabase/` for database operations
