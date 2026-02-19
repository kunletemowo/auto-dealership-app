# Admin Link Not Showing - Troubleshooting

If the Admin link doesn't appear in the header for an admin user, follow these steps:

## 1. Ensure Your User Is an Admin

Run this in **Supabase Dashboard → SQL Editor** (replace with your email):

```sql
-- Set yourself as admin (replace with your actual email)
DO $$
DECLARE
  target_email TEXT := 'your-email@example.com';
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = target_email LIMIT 1;
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User not found. Check the email.';
  END IF;
  
  -- Add to user_roles
  INSERT INTO user_roles (user_id, role, assigned_at)
  VALUES (user_uuid, 'admin', NOW())
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  
  -- Update profiles.role (add role column if missing - see step 2)
  UPDATE profiles SET role = 'admin' WHERE id = user_uuid;
  
  RAISE NOTICE 'User % set as admin', target_email;
END $$;
```

## 2. Ensure profiles.role Column Exists

If you get "column role does not exist", run the RBAC migration first:
- **CREATE_RBAC_SYSTEM.sql** (creates user_roles, adds role to profiles)

## 3. Add Service Role Key for Admin Check

The Admin link uses `/api/admin/check` which reads the `profiles` table. Add to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase
```

Get it from: **Supabase → Settings → API → service_role key**

Restart your dev server after adding.

## 4. Direct Access (Temporary Workaround)

You can go directly to:
- **http://localhost:3000/admin/spec-requests** – Spec requests
- **http://localhost:3000/admin/users** – User management

If you're an admin, these pages will load. If not, you'll be redirected.

## 5. Verify Admin Status

Run in Supabase SQL Editor to confirm:

```sql
SELECT p.id, p.display_name, p.role, ur.role as user_roles_role
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.id
WHERE p.id IN (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

You should see `role = 'admin'` in profiles and/or user_roles.
