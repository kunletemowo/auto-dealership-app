# Fix: Function Search Path Security Warning

## Issue Description

Supabase is reporting security warnings for functions without explicit `search_path`:
```
Function Search Path Mutable
security

Entity: public.handle_new_user
Issue: Function public.handle_new_user has a role mutable search_path

Entity: public.update_updated_at_column
Issue: Function public.update_updated_at_column has a role mutable search_path

Description: Detects functions where the search_path parameter is not set.
```

## Why This is a Security Concern

When a PostgreSQL function doesn't have an explicit `search_path` set, it can be vulnerable to **search_path manipulation attacks**. 

### How the Attack Works:
1. A malicious user could create objects (tables, functions) in their own schema
2. They could manipulate the `search_path` to point to their schema first
3. When the function executes, it might accidentally use their malicious objects instead of the intended ones in the `public` schema
4. This could lead to unauthorized data access or code execution

### The Risk:
- `handle_new_user()` is a `SECURITY DEFINER` function (runs with elevated privileges), making it particularly vulnerable
- `update_updated_at_column()` is used by triggers on multiple tables, so securing it protects multiple data operations

## The Solution

We need to explicitly set the `search_path` in the function definition to only allow access to:
- `public` schema (where our tables are)
- `pg_temp` schema (for temporary objects needed during execution)

This prevents the function from accidentally looking in other schemas.

## How to Fix

### Step 1: Run the SQL Migrations

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Fix handle_new_user Function**
   - Copy the contents of `FIX_HANDLE_NEW_USER_SEARCH_PATH.sql`
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl + Enter` (Windows) / `Cmd + Enter` (Mac)

4. **Fix update_updated_at_column Function**
   - Copy the contents of `FIX_UPDATE_UPDATED_AT_SEARCH_PATH.sql`
   - Paste into the SQL Editor (new query)
   - Click "Run" or press `Ctrl + Enter` (Windows) / `Cmd + Enter` (Mac)

   **Note:** You can also run both migrations in a single query by combining them.

### Step 2: Verify the Fixes

After running the migrations, verify they worked:

1. **Check the Function Definitions**
   ```sql
   -- Check handle_new_user
   SELECT 
     routine_name, 
     routine_definition,
     external_name as search_path
   FROM information_schema.routines 
   WHERE routine_name = 'handle_new_user';
   
   -- Check update_updated_at_column
   SELECT 
     routine_name, 
     routine_definition,
     external_name as search_path
   FROM information_schema.routines 
   WHERE routine_name = 'update_updated_at_column';
   ```

2. **Check Supabase Dashboard**
   - Go to Database → Functions in Supabase dashboard
   - The security warnings should disappear after a few minutes
   - Or check the Security Advisor/Advisor section

### Step 3: Test Functionality

1. **Test User Signup**
   - Try creating a new user account
   - Verify that the profile is created correctly with:
     - `id` matching the user ID
     - `display_name` populated
     - `first_name` and `last_name` populated
     - `city` set to 'Unknown'

2. **Test updated_at Triggers**
   - Update a profile record and verify `updated_at` changes
   - Update a car_listing record and verify `updated_at` changes
   - The triggers should still work as before

## What Changed

The function definition now includes:
```sql
SET search_path = public, pg_temp
```

This explicitly tells PostgreSQL to only look in:
- `public` schema: Where our `profiles` table lives
- `pg_temp` schema: For any temporary objects needed during execution

All other schemas are excluded, preventing search_path manipulation attacks.

## Technical Details

### handle_new_user Function

**Before (Vulnerable):**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Function body
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**After (Secure):**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Function body
END;
$$;
```

### update_updated_at_column Function

**Before (Vulnerable):**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';
```

**After (Secure):**
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
```

**The key addition for both functions:** `SET search_path = public, pg_temp`

## Additional Notes

- This change is **backward compatible** - existing functionality remains the same
- The function will continue to work exactly as before
- This is a **security hardening** measure, not a bug fix
- All `SECURITY DEFINER` functions should have explicit `search_path` set

## Related Files

- `FIX_HANDLE_NEW_USER_SEARCH_PATH.sql` - Fix for handle_new_user function
- `FIX_UPDATE_UPDATED_AT_SEARCH_PATH.sql` - Fix for update_updated_at_column function
- `ADD_FIRST_LAST_NAME_TO_PROFILES.sql` - Previous handle_new_user definition
- `FIX_PROFILE_TRIGGER.sql` - Earlier version of handle_new_user
- `supabase-setup.sql` - Original function definitions

## References

- [PostgreSQL Function Security](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Supabase Function Security](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL search_path Documentation](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PATH)
