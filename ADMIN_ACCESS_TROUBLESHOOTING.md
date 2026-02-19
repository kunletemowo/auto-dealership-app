# Admin Access Troubleshooting Guide

## Issue: Cannot Access `/admin/users` Page

If you can't access the admin page, follow these steps:

## Step 1: Verify RBAC Migration Was Run

1. **Check if tables exist:**
   - Go to Supabase Dashboard → Table Editor
   - Look for `user_roles` and `user_permissions` tables
   - If they don't exist, run `CREATE_RBAC_SYSTEM.sql` first

2. **Check if functions exist:**
   - Go to Supabase Dashboard → Database → Functions
   - Look for `user_has_permission` and `get_user_permissions`
   - If they don't exist, the migration wasn't completed

## Step 2: Verify Admin User Was Created

Run this query in Supabase SQL Editor:

```sql
SELECT 
  p.id,
  p.display_name,
  ur.role,
  p.role as profile_role
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.id
WHERE p.id IN (
  SELECT id FROM auth.users WHERE email = 'testuser@gmail.com'
);
```

**Expected Result:**
- Should show `role = 'admin'` in either `user_roles.role` or `profiles.role`
- If both are NULL or 'user', the admin wasn't created

**Fix:** Run `CREATE_FIRST_ADMIN.sql` to create the admin user

## Step 3: Verify You're Logged In

1. **Check current user:**
   - Make sure you're signed in as `testuser@gmail.com`
   - Check the UserMenu in the header - it should show your email

2. **Sign out and sign back in:**
   - Sometimes auth state needs to be refreshed
   - Sign out completely
   - Sign in again as `testuser@gmail.com`

## Step 4: Check Browser Console

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Navigate to `/admin/users`**
4. **Look for errors:**
   - "Error checking permission" - RPC function issue
   - "Unauthorized" - User not admin
   - "Table doesn't exist" - Migration not run

## Step 5: Direct URL Access

Try accessing the page directly:
- URL: `http://localhost:3000/admin/users` (development)
- Or: `https://yourdomain.com/admin/users` (production)

**If you get redirected to `/`:**
- This means the admin check is failing
- Check Steps 1-3 above

## Step 6: Check Admin Link in Header

After logging in as admin:
- Look for "Admin" link in the header navigation
- It should appear between "Sell Your Car" and "More"
- If it doesn't appear, the admin check is failing

## Quick Fix: Manual Admin Check

If the RPC functions aren't working, you can manually verify admin status:

```sql
-- Check if user is admin
SELECT 
  ur.role,
  p.role as profile_role,
  au.email
FROM auth.users au
LEFT JOIN user_roles ur ON ur.user_id = au.id
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'testuser@gmail.com';
```

**Both should show 'admin':**
- `ur.role` should be 'admin'
- `p.role` should be 'admin'

## Common Issues and Solutions

### Issue: "Table user_roles does not exist"
**Solution:** Run `CREATE_RBAC_SYSTEM.sql` migration

### Issue: "Function user_has_permission does not exist"
**Solution:** The migration didn't complete. Re-run `CREATE_RBAC_SYSTEM.sql`

### Issue: Page redirects to "/"
**Solution:** 
1. Verify admin user was created (Step 2)
2. Sign out and sign back in
3. Check browser console for errors

### Issue: "Unauthorized: Admin access required"
**Solution:**
1. Run `CREATE_FIRST_ADMIN.sql` to set yourself as admin
2. Verify with the query in Step 2
3. Sign out and sign back in

### Issue: Admin link doesn't appear in header
**Solution:**
1. Check if you're logged in
2. Verify admin status (Step 2)
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for API errors

## Testing Admin Access

1. **Sign in** as `testuser@gmail.com`
2. **Look for "Admin" link** in header
3. **Click "Admin"** or navigate to `/admin/users`
4. **Should see** "User Access Management" page
5. **If redirected**, check console and follow troubleshooting steps

## Still Not Working?

1. **Check Supabase Logs:**
   - Dashboard → Logs → Postgres Logs
   - Look for errors related to `user_roles` or `user_permissions`

2. **Verify Environment Variables:**
   - Check `.env.local` has correct Supabase credentials
   - Restart dev server after changes

3. **Clear Browser Cache:**
   - Hard refresh (Ctrl+Shift+R)
   - Clear cookies for localhost
   - Try incognito/private mode

4. **Check Network Tab:**
   - Open DevTools → Network
   - Navigate to `/admin/users`
   - Check if `/api/admin/check` returns `{ isAdmin: true }`

## Success Indicators

You'll know it's working when:
- ✅ "Admin" link appears in header (when logged in as admin)
- ✅ Can navigate to `/admin/users` without redirect
- ✅ See "User Access Management" page
- ✅ Can see list of users (or empty state if no users)
- ✅ Can search for users
- ✅ Can manage roles and permissions
