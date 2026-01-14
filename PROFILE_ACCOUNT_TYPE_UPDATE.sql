-- =====================================================
-- Add account_type field to profiles table
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to add the account_type field
-- =====================================================

-- Add account_type column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'individual';

-- Add check constraint to ensure only valid values
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_account_type_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_account_type_check 
CHECK (account_type IN ('individual', 'business'));

-- Update existing profiles to have 'individual' as default if null
UPDATE profiles 
SET account_type = 'individual' 
WHERE account_type IS NULL;
