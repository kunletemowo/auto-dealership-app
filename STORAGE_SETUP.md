# Storage Bucket Setup - Copy This SQL

If you're having trouble opening the `.sql` file, copy and paste this SQL directly into your Supabase SQL Editor.

## Step 1: Create the Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name: `car-images`
4. ✅ Check **Public bucket** (important!)
5. Click **Create bucket**

## Step 2: Run Storage Policies SQL

After creating the bucket, go to **SQL Editor** → **New Query**, then paste and run this SQL:

```sql
-- =====================================================
-- Auto Sales Platform - Supabase Storage Policies
-- =====================================================
-- Run this AFTER creating the 'car-images' bucket in Storage
-- =====================================================

-- =====================================================
-- STORAGE POLICIES FOR car-images BUCKET
-- =====================================================

-- Allow anyone to view car images (public read)
CREATE POLICY "Anyone can view car images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploaded images
CREATE POLICY "Users can update own car images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'car-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'car-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete own car images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'car-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## That's It!

Your storage bucket is now configured. The policies allow:
- ✅ Anyone to view images (public read)
- ✅ Authenticated users to upload images
- ✅ Users to update/delete their own images

## Verification

To verify the setup worked:
1. Go to **Storage** → **Policies** tab
2. You should see 4 policies for the `car-images` bucket
3. The bucket should show as **Public**

## Notes

- The storage policies work with the file path structure: `{listing_id}/{filename}`
- Users can only manage images in folders named with their user ID
- Images are publicly viewable once uploaded (good for car listings)

---

# Profile Avatar Storage Setup

## Step 1: Create the Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name: `profile-avatars`
4. ✅ Check **Public bucket** (important!)
5. Click **Create bucket**

## Step 2: Run Storage Policies SQL

After creating the bucket, go to **SQL Editor** → **New Query**, then paste and run the SQL from `PROFILE_AVATAR_STORAGE_POLICIES.sql`:

The policies allow:
- ✅ Anyone to view avatars (public read)
- ✅ Authenticated users to upload their own avatars
- ✅ Users to update/delete their own avatars

## Notes

- The storage policies work with the file path structure: `{user_id}/avatar-{timestamp}.{ext}`
- Users can only manage avatars in folders named with their user ID
- Avatars are publicly viewable once uploaded (good for profile display)
