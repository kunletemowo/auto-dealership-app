-- =====================================================
-- Role-Based Access Control (RBAC) System
-- =====================================================
-- This script creates a comprehensive RBAC system for admin users
-- to manage CRUD access for all users
-- =====================================================

-- =====================================================
-- 1. CREATE ROLE ENUM
-- =====================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. CREATE PERMISSIONS ENUM
-- =====================================================

DO $$ BEGIN
  CREATE TYPE permission_type AS ENUM (
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'listings.read',
    'listings.create',
    'listings.update',
    'listings.delete',
    'listings.moderate',
    'profiles.read',
    'profiles.update',
    'profiles.delete',
    'admin.access'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 3. CREATE USER_ROLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- 4. CREATE USER_PERMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  permission permission_type NOT NULL,
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

-- =====================================================
-- 5. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON user_permissions(permission);

-- =====================================================
-- 6. ADD ROLE COLUMN TO PROFILES (for quick access)
-- =====================================================

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- =====================================================
-- 7. CREATE FUNCTION TO SYNC ROLE TO PROFILES
-- =====================================================

CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profiles.role when user_roles.role changes
  UPDATE profiles
  SET role = NEW.role
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Create trigger to sync role
DROP TRIGGER IF EXISTS sync_role_to_profiles ON user_roles;
CREATE TRIGGER sync_role_to_profiles
  AFTER INSERT OR UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role();

-- =====================================================
-- 8. CREATE FUNCTION TO CHECK USER PERMISSIONS
-- =====================================================

CREATE OR REPLACE FUNCTION user_has_permission(
  check_user_id UUID,
  required_permission permission_type
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
  has_permission BOOLEAN := FALSE;
BEGIN
  -- Get user's role
  SELECT role INTO user_role_val
  FROM user_roles
  WHERE user_id = check_user_id;
  
  -- If no role found, default to 'user'
  IF user_role_val IS NULL THEN
    user_role_val := 'user';
  END IF;
  
  -- Admins have all permissions
  IF user_role_val = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has explicit permission
  SELECT EXISTS (
    SELECT 1
    FROM user_permissions
    WHERE user_id = check_user_id
    AND permission = required_permission
  ) INTO has_permission;
  
  -- Moderators have some default permissions
  IF user_role_val = 'moderator' AND NOT has_permission THEN
    -- Moderators can read and moderate by default
    IF required_permission IN ('listings.read', 'listings.moderate', 'profiles.read') THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- =====================================================
-- 9. CREATE FUNCTION TO GET USER PERMISSIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_permissions(check_user_id UUID)
RETURNS TABLE(permission permission_type) AS $$
DECLARE
  user_role_val user_role;
BEGIN
  -- Get user's role
  SELECT role INTO user_role_val
  FROM user_roles
  WHERE user_id = check_user_id;
  
  -- If no role found, default to 'user'
  IF user_role_val IS NULL THEN
    user_role_val := 'user';
  END IF;
  
  -- Admins have all permissions
  IF user_role_val = 'admin' THEN
    RETURN QUERY
    SELECT unnest(ARRAY[
      'users.read'::permission_type,
      'users.create'::permission_type,
      'users.update'::permission_type,
      'users.delete'::permission_type,
      'listings.read'::permission_type,
      'listings.create'::permission_type,
      'listings.update'::permission_type,
      'listings.delete'::permission_type,
      'listings.moderate'::permission_type,
      'profiles.read'::permission_type,
      'profiles.update'::permission_type,
      'profiles.delete'::permission_type,
      'admin.access'::permission_type
    ]);
    RETURN;
  END IF;
  
  -- Return explicit permissions
  RETURN QUERY
  SELECT up.permission
  FROM user_permissions up
  WHERE up.user_id = check_user_id;
  
  -- Add default moderator permissions if applicable
  IF user_role_val = 'moderator' THEN
    RETURN QUERY
    SELECT unnest(ARRAY[
      'listings.read'::permission_type,
      'listings.moderate'::permission_type,
      'profiles.read'::permission_type
    ])
    WHERE NOT EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_id = check_user_id
      AND permission = unnest(ARRAY[
        'listings.read'::permission_type,
        'listings.moderate'::permission_type,
        'profiles.read'::permission_type
      ])
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- =====================================================
-- 10. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 11. CREATE RLS POLICIES FOR USER_ROLES
-- =====================================================

-- Admins can view all roles
CREATE POLICY "Admins can view all user roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can insert roles
CREATE POLICY "Admins can create user roles"
  ON user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can update roles
CREATE POLICY "Admins can update user roles"
  ON user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can delete roles
CREATE POLICY "Admins can delete user roles"
  ON user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Users can view their own role
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- =====================================================
-- 12. CREATE RLS POLICIES FOR USER_PERMISSIONS
-- =====================================================

-- Admins can view all permissions
CREATE POLICY "Admins can view all permissions"
  ON user_permissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can grant permissions
CREATE POLICY "Admins can grant permissions"
  ON user_permissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admins can revoke permissions
CREATE POLICY "Admins can revoke permissions"
  ON user_permissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Users can view their own permissions
CREATE POLICY "Users can view own permissions"
  ON user_permissions FOR SELECT
  USING (user_id = auth.uid());

-- =====================================================
-- 13. CREATE DEFAULT ADMIN USER (OPTIONAL)
-- =====================================================
-- Uncomment and modify to create your first admin user
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from auth.users

-- INSERT INTO user_roles (user_id, role, assigned_at)
-- VALUES ('YOUR_USER_ID_HERE', 'admin', NOW())
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Create your first admin user (see step 13 above)
-- 2. Use the admin UI to manage other users' roles and permissions
-- 3. Implement permission checks in your application code
