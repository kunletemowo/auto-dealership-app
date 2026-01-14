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
