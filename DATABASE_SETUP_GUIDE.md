# Database Setup Guide for Supabase

This guide will walk you through setting up your Supabase database for the Auto Sales Platform.

## Prerequisites

- ✅ Supabase project created
- ✅ Authentication enabled (email only)
- ✅ Access to Supabase SQL Editor

## Step-by-Step Setup

### Step 1: Run the Main Database Setup Script

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file `supabase-setup.sql` in this project
5. Copy the entire contents of `supabase-setup.sql`
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

This script will:
- Create custom types (enums) for transmission, fuel type, and condition
- Create the `profiles` table
- Create the `car_listings` table
- Create the `car_images` table
- Set up indexes for performance
- Enable Row Level Security (RLS)
- Create all RLS policies
- Create triggers for auto-updating timestamps
- Create a trigger to auto-create profiles when users sign up

### Step 2: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage** (left sidebar)
2. Click **New bucket**
3. Set the following:
   - **Name**: `car-images`
   - **Public bucket**: ✅ Check this box (so images can be viewed by anyone)
   - **File size limit**: (optional, e.g., 5MB)
   - **Allowed MIME types**: (optional, e.g., `image/jpeg,image/png,image/webp`)
4. Click **Create bucket**

### Step 3: Run Storage Policies Script

1. Go back to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase-storage-policies.sql` in this project
4. Copy the entire contents
5. Paste it into the SQL Editor
6. Click **Run**

This will set up the security policies for the storage bucket.

### Step 4: Verify Setup

Run these queries in the SQL Editor to verify everything is set up correctly:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'car_listings', 'car_images');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'car_listings', 'car_images');

-- Check if storage bucket exists
SELECT name, public 
FROM storage.buckets 
WHERE name = 'car-images';
```

You should see:
- All three tables listed
- All three tables with `rowsecurity = true`
- The `car-images` bucket with `public = true`

## Database Schema Overview

### Tables Created

1. **profiles**
   - Stores user profile information
   - Linked to `auth.users` via UUID
   - Auto-created when a user signs up

2. **car_listings**
   - Stores all car listing information
   - Includes make, model, year, price, location, etc.
   - Linked to profiles via `user_id`

3. **car_images**
   - Stores image URLs for car listings
   - Linked to car_listings via `listing_id`
   - Supports multiple images per listing

### Security (RLS Policies)

- **Profiles**: Anyone can view, users can only update their own
- **Car Listings**: Anyone can view active listings, users can manage their own
- **Car Images**: Anyone can view images for active listings, users can manage images for their own listings
- **Storage**: Public read, authenticated users can upload, users can manage their own uploads

## Troubleshooting

### Error: "relation already exists"
If you see this error, it means some tables/types already exist. The script uses `CREATE IF NOT EXISTS` and `DO $$ BEGIN ... EXCEPTION` blocks to handle this, but if you still get errors:
- You can safely ignore them if the table already exists
- Or drop the existing tables first (be careful - this will delete data!)

### Error: "permission denied"
Make sure you're running the SQL as a database admin/superuser. In Supabase, you should have full permissions by default.

### Storage bucket not showing up
- Make sure you created the bucket with the exact name `car-images`
- Check that the bucket is set to Public
- Refresh the Storage page

### RLS policies not working
- Verify RLS is enabled: Check that `rowsecurity = true` for all tables
- Make sure you're testing with an authenticated user
- Check the browser console for specific error messages

## Next Steps

After completing the database setup:

1. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key from Settings > API

2. **Test the Application**
   - Run `npm install` (if not done already)
   - Run `npm run dev`
   - Try creating an account and listing a car

3. **Verify Everything Works**
   - Sign up a test user
   - Create a test listing
   - Check that it appears in the database
   - Verify images can be uploaded (when image upload is implemented)

## Support

If you encounter any issues:
1. Check the Supabase logs (Dashboard > Logs)
2. Check the browser console for errors
3. Verify all SQL scripts ran successfully
4. Ensure environment variables are set correctly
