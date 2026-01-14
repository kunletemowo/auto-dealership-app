# Profile Location Fields Migration Instructions

## Error: "Could not find the 'address' column of 'profiles' in the schema cache"

This error occurs because the database migration to add the new location fields hasn't been run yet.

## Solution: Run the SQL Migration

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Run the Migration

1. Open the file `ADD_PROFILE_LOCATION_FIELDS.sql` in your project
2. Copy the entire contents of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

### Step 3: Verify the Migration

After running the migration, verify the columns were added:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('address', 'city', 'province', 'postal_code');
```

You should see all four columns listed.

### Step 4: Clear Schema Cache (if needed)

If you still see the error after running the migration:

1. In Supabase dashboard, go to **Settings** → **API**
2. Scroll down and click **Clear cache** or **Refresh schema**
3. Wait a few seconds
4. Refresh your application page

## What the Migration Does

The migration:
- Adds `address` column (nullable TEXT)
- Adds `city` column (required TEXT, NOT NULL)
- Adds `province` column (nullable TEXT)
- Adds `postal_code` column (nullable TEXT)
- Backfills existing `location` data into `city` where possible
- Sets a default "Unknown" for any NULL city values before making it required

## After Migration

Once the migration is complete:
- The profile form will work correctly
- You can save address, city, province, and postal code separately
- The old `location` field is still maintained for backward compatibility

## Troubleshooting

### Still seeing the error after migration?

1. **Check if columns exist:**
   ```sql
   SELECT * FROM profiles LIMIT 1;
   ```
   If this fails, the table might not exist.

2. **Check Supabase connection:**
   - Verify your `.env.local` has correct Supabase credentials
   - Check that you're connected to the right project

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

4. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### Migration fails with "column already exists"?

This means the migration was partially run. You can safely ignore those errors, or run this to check what's missing:

```sql
-- Check which columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('address', 'city', 'province', 'postal_code');
```

Then manually add any missing columns:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
```

## Need Help?

If you continue to experience issues:
1. Check the Supabase logs for detailed error messages
2. Verify your database connection is working
3. Ensure you have the correct permissions to alter the profiles table
