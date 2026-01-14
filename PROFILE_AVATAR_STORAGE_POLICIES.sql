-- =====================================================
-- Auto Sales Platform - Profile Avatar Storage Policies
-- =====================================================
-- Run this AFTER creating the 'profile-avatars' bucket in Storage
-- =====================================================

-- =====================================================
-- STORAGE POLICIES FOR profile-avatars BUCKET
-- =====================================================

-- Allow anyone to view profile avatars (public read)
CREATE POLICY "Anyone can view profile avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Authenticated users can upload profile avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-avatars' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own uploaded avatars
CREATE POLICY "Users can update own profile avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own uploaded avatars
CREATE POLICY "Users can delete own profile avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
