-- =====================================================
-- Sync Admin Roles to Profiles Table
-- =====================================================
-- This script ensures that admin roles from user_roles table
-- are properly synced to the profiles.role column
-- This is important because we prioritize profiles.role to avoid RLS recursion
-- =====================================================

-- Update profiles.role based on user_roles table
UPDATE profiles p
SET role = ur.role::user_role
FROM user_roles ur
WHERE p.id = ur.user_id
AND ur.role = 'admin'
AND (p.role IS NULL OR p.role != 'admin');

-- Also ensure the sync_user_role() trigger function is working
-- This function should automatically sync roles when user_roles changes
-- But we'll manually sync here to be safe

-- =====================================================
-- Verification
-- =====================================================
-- After running this, check that your admin user has role = 'admin' in profiles:
-- SELECT id, display_name, role FROM profiles WHERE role = 'admin';
-- =====================================================

-- If you need to manually set a specific user as admin:
-- UPDATE profiles SET role = 'admin'::user_role WHERE id = 'USER_ID_HERE';
-- (Replace USER_ID_HERE with the actual user UUID from auth.users)
