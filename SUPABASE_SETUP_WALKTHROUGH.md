# Supabase Setup Walkthrough

This guide will walk you through connecting your Next.js project to your Supabase database.

## Step 1: Get Your Supabase Credentials

1. **Open Supabase Dashboard**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Log in and select your project

2. **Navigate to API Settings**
   - Click the **Settings** icon (⚙️) in the left sidebar
   - Click **API** in the settings menu

3. **Copy Your Credentials**
   - **Project URL**: Found in the "Project URL" section
     - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
     - Click the copy icon or select and copy
   
   - **anon public key**: Found in "Project API keys" section
     - Look for the **anon public** key (NOT the service_role key!)
     - Click the "Copy" button next to it
     - It's a long string starting with `eyJ...`

## Step 2: Create .env.local File

1. **In your code editor**, navigate to the project root folder
2. **Create a new file** named `.env.local`
   - Right-click in the file explorer → New File
   - Name it exactly: `.env.local` (with the dot at the beginning)

3. **Add the following content:**

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Replace the placeholders** with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourprojectid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ Important:**
- No quotes around the values
- No spaces before or after the `=` sign
- Keep the `NEXT_PUBLIC_` prefix (required for Next.js)

## Step 3: Verify Dependencies Are Installed

Check if required packages are installed:

1. Open `package.json`
2. Look for these in `dependencies`:
   - `@supabase/ssr`
   - `zod`
   - `clsx`
   - `tailwind-merge`

If any are missing, install them:
```bash
npm install @supabase/ssr zod clsx tailwind-merge
```

## Step 4: Verify Supabase Client Files

The project already has Supabase client setup files:
- ✅ `src/lib/supabase/client.ts` - For browser/client components
- ✅ `src/lib/supabase/server.ts` - For server components/actions

These are already configured correctly! No changes needed.

## Step 5: Test the Connection

1. **Start the development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Check for errors**:
   - Look at the terminal for any error messages
   - Check the browser console (F12) for errors
   - If you see Supabase connection errors, verify your `.env.local` file

## Step 6: Test Authentication (Optional but Recommended)

1. **Navigate to** `http://localhost:3000/register`
2. **Try creating an account** with a test email
3. **Check Supabase Dashboard**:
   - Go to Authentication → Users
   - You should see the new user
   - Go to Table Editor → profiles
   - You should see a profile automatically created (thanks to the trigger we set up!)

## Verification Checklist

- [ ] `.env.local` file created with correct values
- [ ] No spaces or quotes in environment variable values
- [ ] `NEXT_PUBLIC_` prefix on all environment variables
- [ ] Dependencies installed (`npm install` completed)
- [ ] Development server starts without errors
- [ ] No Supabase connection errors in console
- [ ] Can navigate to pages without errors

## Common Issues

### "Invalid API key" error
- Double-check you copied the **anon public** key, not service_role
- Verify no extra spaces in `.env.local`
- Make sure the key starts with `eyJ...`

### "Failed to fetch" or connection errors
- Verify your Project URL is correct
- Check that your Supabase project is active (not paused)
- Ensure the URL starts with `https://`

### Environment variables not loading
- Restart the dev server after creating `.env.local`
- Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
- Check you're in the project root directory

### "Module not found: @supabase/ssr"
- Run `npm install` to install dependencies
- Verify `package.json` includes `@supabase/ssr`

## Next Steps

Once everything is working:
1. ✅ Test user registration
2. ✅ Test user login
3. ✅ Test creating a car listing
4. ✅ Verify data appears in Supabase dashboard

## Need Help?

If you encounter issues:
1. Check the terminal output for specific error messages
2. Check browser console (F12 → Console tab)
3. Verify your Supabase project is active
4. Double-check `.env.local` file contents
