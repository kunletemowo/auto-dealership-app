-- =====================================================
-- Create First Admin User
-- =====================================================
-- This script creates the first admin user for the RBAC system
-- Replace 'testuser@gmail.com' with the actual email if different
-- =====================================================

-- Method 1: If you know the user ID
-- Uncomment and replace 'USER_ID_HERE' with the actual UUID from auth.users
-- INSERT INTO user_roles (user_id, role, assigned_at)
-- VALUES ('USER_ID_HERE', 'admin', NOW())
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Method 2: Find user by email and set as admin (Recommended)
-- This uses a function to safely get the user ID from auth.users

DO $$
DECLARE
  target_email TEXT := 'testuser@gmail.com';
  user_uuid UUID;
BEGIN
  -- Find the user ID by email from auth.users
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = target_email
  LIMIT 1;

  -- Check if user was found
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Please verify the email address exists in auth.users.', target_email;
  END IF;

  -- Insert or update the user role to admin
  INSERT INTO user_roles (user_id, role, assigned_at)
  VALUES (user_uuid, 'admin', NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

  -- Also update the profiles.role column (will be synced by trigger, but doing it explicitly)
  UPDATE profiles
  SET role = 'admin'
  WHERE id = user_uuid;

  RAISE NOTICE 'Successfully set user % (ID: %) as admin', target_email, user_uuid;
END $$;

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify the admin was created successfully

SELECT 
  p.id,
  p.display_name,
  au.email,
  ur.role,
  ur.assigned_at
FROM user_roles ur
JOIN profiles p ON p.id = ur.user_id
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.assigned_at DESC;

-- =====================================================
-- Alternative: If the above doesn't work, use this simpler version
-- =====================================================
-- First, get the user ID manually:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Find the user with email 'testuser@gmail.com'
-- 3. Copy the User UID
-- 4. Then run:

-- INSERT INTO user_roles (user_id, role, assigned_at)
-- VALUES ('PASTE_USER_ID_HERE', 'admin', NOW())
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
