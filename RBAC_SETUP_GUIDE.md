# Role-Based Access Control (RBAC) Setup Guide

## Overview

This RBAC system allows admin users to manage CRUD access for all users. The system includes:

- **Roles**: Admin, Moderator, User
- **Permissions**: Granular CRUD permissions for users, listings, and profiles
- **Admin UI**: Interface for managing user roles and permissions
- **Search**: Ability to find and update access for any user (including read-only users)

## Features

1. **Role-Based Access**: Three-tier role system (Admin, Moderator, User)
2. **Granular Permissions**: Fine-grained control over CRUD operations
3. **Admin Visibility**: Only admins and users with admin rights are visible by default
4. **User Search**: Search for any user (including read-only) to update their access
5. **Permission Management**: Grant/revoke specific permissions to users

## Setup Instructions

### Step 1: Run Database Migration

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy and paste** the contents of `CREATE_RBAC_SYSTEM.sql`
3. **Run the query**
4. **Verify** tables were created:
   - `user_roles`
   - `user_permissions`
   - Check that `profiles` table has a `role` column

### Step 2: Create Your First Admin User

After running the migration, you need to create your first admin user:

1. **Get your user ID**:
   - Go to Supabase Dashboard → Authentication → Users
   - Find your user account
   - Copy the User UID

2. **Set yourself as admin**:
   ```sql
   INSERT INTO user_roles (user_id, role, assigned_at)
   VALUES ('YOUR_USER_ID_HERE', 'admin', NOW())
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
   ```
   Replace `YOUR_USER_ID_HERE` with your actual user ID.

3. **Verify**:
   ```sql
   SELECT * FROM user_roles WHERE role = 'admin';
   ```

### Step 3: Access Admin Panel

1. **Navigate** to `/admin/users` in your application
2. **Verify** you can see the admin interface
3. **Test** by searching for users and managing their access

## Permission Types

The system includes the following permissions:

- **Users**: `users.read`, `users.create`, `users.update`, `users.delete`
- **Listings**: `listings.read`, `listings.create`, `listings.update`, `listings.delete`, `listings.moderate`
- **Profiles**: `profiles.read`, `profiles.update`, `profiles.delete`
- **Admin**: `admin.access`

## Role Defaults

### Admin
- Has **all permissions** automatically
- Can manage all users and their access
- Can perform all CRUD operations

### Moderator
- Default permissions: `listings.read`, `listings.moderate`, `profiles.read`
- Can be granted additional permissions
- Cannot manage user access (unless granted `admin.access`)

### User
- No default permissions (except their own data)
- Can be granted specific permissions
- Cannot manage other users

## Usage

### Managing User Roles

1. Go to `/admin/users`
2. Find the user (or search for them)
3. Click "Manage" on the user card
4. Select a role: Admin, Moderator, or User
5. Changes are saved automatically

### Managing Permissions

1. Click "Manage" on a user
2. Scroll to "Permissions" section
3. Check/uncheck permissions as needed
4. Changes are saved automatically

### Searching for Users

1. Use the search bar at the top
2. Search by name or email (minimum 2 characters)
3. Results include all users (including read-only)
4. Click "Clear" to return to default view

## Visibility Rules

### Default View (No Search)
- Shows only:
  - Users with `admin` role
  - Users with `moderator` role
  - Users with explicit permissions (in `user_permissions` table)

### Search View
- Shows **all users** matching the search query
- Allows admins to find and update access for any user
- Useful for granting permissions to read-only users

## Security Features

1. **Row Level Security (RLS)**: All tables have RLS enabled
2. **Admin-Only Access**: Only admins can modify roles and permissions
3. **Last Admin Protection**: Cannot remove the last admin user
4. **Audit Trail**: Tracks who assigned roles/permissions and when

## Code Usage

### Check Permissions in Your Code

```typescript
import { hasPermission, isAdmin, getUserRole } from "@/lib/utils/permissions";

// Check specific permission
const canDelete = await hasPermission("listings.delete");

// Check if admin
const isUserAdmin = await isAdmin();

// Get user role
const role = await getUserRole();
```

### Protect Routes

```typescript
// In a server component or route handler
import { isAdmin } from "@/lib/utils/permissions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    redirect("/");
  }
  // ... rest of component
}
```

### Protect Server Actions

```typescript
"use server";

import { isAdmin } from "@/lib/utils/permissions";

export async function adminAction() {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized" };
  }
  // ... action logic
}
```

## Troubleshooting

### "Unauthorized: Admin access required"
- Make sure you've set yourself as admin (Step 2)
- Verify your user ID is correct
- Check that `user_roles` table has your entry

### No users showing in admin panel
- This is normal if no users have admin/moderator roles or permissions
- Use the search function to find users
- Create your first admin user (Step 2)

### Permission checks not working
- Verify RLS policies are enabled
- Check that functions have `SECURITY DEFINER` set
- Ensure `search_path` is set correctly in functions

### Email not showing for users
- Email is fetched from `auth.users` which requires admin access
- Make sure you're using the service role key for admin operations (server-side only)
- Or use the `supabase.auth.admin.getUserById()` method

## Best Practices

1. **Always have at least 2 admins** to avoid lockout
2. **Grant minimal permissions** - only what users need
3. **Regular audits** - review user permissions periodically
4. **Use roles for common patterns** - use roles for groups, permissions for specific needs
5. **Document custom permissions** - if you add new permissions, document their purpose

## Next Steps

1. Set up your first admin user
2. Test the admin interface
3. Assign roles to key users
4. Grant specific permissions as needed
5. Implement permission checks in your application code

## Support

If you encounter issues:
1. Check Supabase Dashboard → Logs for errors
2. Verify RLS policies are correct
3. Check that functions are created properly
4. Review the SQL migration for any errors
