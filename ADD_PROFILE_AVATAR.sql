-- =====================================================
-- Add avatar_url field to profiles table
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to add the avatar_url field
-- =====================================================

-- Add avatar_url column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for avatar_url (optional, but can help with queries)
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON profiles(avatar_url) WHERE avatar_url IS NOT NULL;
