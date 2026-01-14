# Favorites Table Setup Instructions

## Error: "Could not find the table 'public.favorites' in the schema cache"

This error occurs because the `favorites` table hasn't been created in your Supabase database yet.

## Solution: Run the SQL Migration

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor** (in the left sidebar)

2. **Create New Query**
   - Click **New Query** button

3. **Run the Migration Script**
   - Copy the entire contents of `CREATE_FAVORITES_TABLE.sql`
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

4. **Verify the Table Was Created**
   - Go to **Table Editor** in the left sidebar
   - You should see a new table called `favorites`
   - The table should have columns: `id`, `user_id`, `listing_id`, `created_at`

5. **Verify RLS Policies**
   - In the `favorites` table, go to the **Policies** tab
   - You should see 3 policies:
     - "Users can view own favorites"
     - "Users can insert own favorites"
     - "Users can delete own favorites"

## What the Migration Does

- Creates the `favorites` table with proper foreign key relationships
- Adds indexes for better query performance
- Enables Row Level Security (RLS)
- Creates security policies so users can only manage their own favorites

## After Running the Migration

Once the migration is complete, refresh your application and try saving a listing again. The error should be resolved.
