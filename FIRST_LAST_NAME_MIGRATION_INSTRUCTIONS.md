# First Name and Last Name Migration Instructions

This migration adds `first_name` and `last_name` fields to the `profiles` table as required (non-nullable) fields.

## Step 1: Run the SQL Migration

1. Go to your Supabase Dashboard → SQL Editor → New Query
2. Copy and paste the entire contents of `ADD_FIRST_LAST_NAME_TO_PROFILES.sql`
3. Click "Run" to execute the migration

## What This Migration Does

1. **Adds `first_name` and `last_name` columns** to the `profiles` table (as nullable first)
2. **Backfills existing profiles** by extracting names from `display_name` field
3. **Makes the columns NOT NULL** after backfilling
4. **Updates the `handle_new_user()` trigger** to automatically store `first_name` and `last_name` from user metadata during signup

## Important Notes

- This migration will update existing user profiles to extract first/last names from their `display_name`
- If a profile doesn't have a `display_name`, it will default to "User" for first_name and empty string for last_name
- New signups will automatically have their first and last names stored from the registration form
- The trigger now includes `city` field (set to 'Unknown' by default) as well as the new name fields

## Verification

After running the migration, verify that:
1. Existing profiles have `first_name` and `last_name` populated
2. New user signups successfully create profiles with first_name and last_name

## Troubleshooting

If you encounter any errors:

1. **"column already exists"**: The columns may already be added. You can skip the `ADD COLUMN` statements and run only the UPDATE and trigger sections.

2. **"violates not-null constraint"**: Make sure the UPDATE statement runs successfully before setting NOT NULL constraints.

3. **Trigger errors on new signups**: Ensure the trigger function includes all required fields (id, display_name, first_name, last_name, city).
