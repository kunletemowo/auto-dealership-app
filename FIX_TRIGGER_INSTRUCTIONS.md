# Fix: "Database error saving new user" - Update Database Trigger

## 🔍 The Problem

The error "Database error saving new user" occurs because:

1. The `city` column in the `profiles` table is now **required (NOT NULL)**
2. The database trigger `handle_new_user()` only inserts `id` and `display_name`
3. Since `city` is required but not provided, the insert fails

## ✅ The Solution

Update the `handle_new_user()` trigger function to include the `city` field.

---

## 📋 Step-by-Step Fix

### Step 1: Open Supabase SQL Editor

1. Go to your **Supabase Dashboard**
2. Click on your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Run This SQL

Copy the entire SQL from `FIX_PROFILE_TRIGGER.sql` and paste it into the SQL Editor:

```sql
-- Update the trigger function to include city field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'Unknown'  -- Default city value since city is required (NOT NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 3: Execute the SQL

1. Click **Run** (or press Ctrl+Enter)
2. You should see: "Success. No rows returned"

### Step 4: Test Signup

1. Go back to your application
2. Try to sign up again
3. The error should be resolved!

---

## 🎯 What This Does

The updated trigger function now:
- Inserts `id` (user UUID)
- Inserts `display_name` (from email or metadata)
- Inserts `city` with a default value of `'Unknown'` (required field)

This ensures the profile is created successfully even though `city` is required.

---

## ✅ Verification

After running the SQL:

1. **Check the function exists:**
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_name = 'handle_new_user';
   ```

2. **Test signup** in your application - it should work!

---

**Note:** New users will have `city = 'Unknown'` initially, and they can update it when they edit their profile.
