# Avatar Upload Troubleshooting Guide

## Error: "Failed to upload avatar"

This error can occur for several reasons. Follow these steps to diagnose and fix the issue.

## Step 1: Check if Storage Bucket Exists

The `profile-avatars` storage bucket must be created in Supabase.

### Create the Bucket:

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Click on **Storage** in the left sidebar
4. Check if you see a bucket named `profile-avatars`
   - **If it exists**: Skip to Step 2
   - **If it doesn't exist**: Continue below

5. Click **New bucket**
6. Enter bucket name: `profile-avatars`
7. ✅ **Important**: Check **Public bucket** (this allows images to be viewed)
8. Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up the storage policies:

1. Go to **SQL Editor** in Supabase
2. Click **New query**
3. Open the file `PROFILE_AVATAR_STORAGE_POLICIES.sql` in your project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

This will create the necessary policies to allow:
- Anyone to view profile avatars (public read)
- Authenticated users to upload their own avatars
- Users to update/delete their own avatars

## Step 3: Verify File Size

The maximum file size is **3MB**. Make sure your image is:
- Less than 3MB in size
- In one of these formats: JPEG, PNG, or WebP

## Step 4: Check Browser Console

If the error persists:

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try uploading an avatar again
4. Look for any error messages
5. Check the **Network** tab for failed requests

Common errors you might see:
- `Bucket not found` → The bucket doesn't exist (see Step 1)
- `new row violates row-level security` → Storage policies not set up (see Step 2)
- `Permission denied` → Storage policies need to be updated

## Step 5: Verify Authentication

Make sure you're logged in:
- The upload requires authentication
- If you're not logged in, you'll get a "Not authenticated" error
- Try logging out and logging back in

## Step 6: Check Network Connection

- Ensure you have a stable internet connection
- Check if other Supabase operations are working
- Try refreshing the page and uploading again

## Common Issues and Solutions

### Issue: "Bucket not found" or "does not exist"
**Solution**: Create the `profile-avatars` bucket in Supabase Storage (Step 1)

### Issue: "Permission denied" or "row-level security"
**Solution**: Run the `PROFILE_AVATAR_STORAGE_POLICIES.sql` file (Step 2)

### Issue: "Image must be less than 3MB"
**Solution**: Compress your image or use a smaller file

### Issue: "Please upload only JPEG, PNG, or WebP images"
**Solution**: Convert your image to one of the supported formats

### Issue: Upload seems to work but image doesn't appear
**Solution**: 
- Check if the `avatar_url` column exists in the profiles table
- Run `ADD_PROFILE_AVATAR.sql` if needed
- Refresh the page after upload

## Quick Verification Checklist

- [ ] `profile-avatars` bucket exists in Supabase Storage
- [ ] Bucket is set to **Public**
- [ ] Storage policies have been run (`PROFILE_AVATAR_STORAGE_POLICIES.sql`)
- [ ] `avatar_url` column exists in `profiles` table
- [ ] Image file is less than 3MB
- [ ] Image is in JPEG, PNG, or WebP format
- [ ] You are logged in
- [ ] Browser console shows no errors

## Still Having Issues?

If you've completed all steps and still see errors:

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Look for errors related to storage or profiles table

2. **Verify Environment Variables**:
   - Check your `.env.local` file
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

3. **Test Storage Directly**:
   - Go to Supabase Storage → `profile-avatars`
   - Try uploading a file manually
   - If this fails, there's a bucket configuration issue

4. **Clear Browser Cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

5. **Restart Dev Server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## Need More Help?

If the issue persists after following all steps:
- Check the browser console for detailed error messages
- Review Supabase logs for server-side errors
- Verify all SQL migrations have been run successfully
