# Environment Variables Setup Guide

This guide will walk you through setting up your environment variables for the Auto Sales Platform.

## Step 1: Copy .env.example to .env.local

### Option A: Using Command Line

Open your terminal in the project root directory and run:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**Windows (Command Prompt):**
```cmd
copy .env.example .env.local
```

**Mac/Linux:**
```bash
cp .env.example .env.local
```

### Option B: Using File Explorer (Windows)

1. Open File Explorer
2. Navigate to your project folder: `C:\Users\kunle\vibe-code-projects-2026\auto-dealership-app`
3. Locate the `.env.example` file
4. Right-click on `.env.example`
5. Select **Copy**
6. Right-click in the same folder and select **Paste**
7. Rename the copied file from `Copy of .env.example` to `.env.local`

### Option C: Using Your Code Editor

1. Open the project in your code editor (VS Code, Cursor, etc.)
2. In the file explorer, find `.env.example`
3. Right-click on `.env.example`
4. Select **Copy** or **Duplicate**
5. Rename the copied file to `.env.local`

## Step 2: Get Your Supabase Credentials

1. **Log in to Supabase**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Log in to your account

2. **Select Your Project**
   - Click on your project name (the auto sales project you created)

3. **Navigate to API Settings**
   - Click on the **Settings** icon (gear icon) in the left sidebar
   - Click on **API** in the settings menu

4. **Find Your Credentials**
   - Look for the **Project URL** section
     - Copy the URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - Look for the **Project API keys** section
     - Find the **anon public** key
     - Click the **Copy** button or select and copy the key
     - This key looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (a long string)

## Step 3: Add Credentials to .env.local

1. **Open `.env.local` file**
   - In your code editor, open the `.env.local` file you just created
   - If you don't see it, make sure "Show hidden files" is enabled in your editor

2. **Replace the placeholder values**

   You should see:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

   Replace with your actual values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Important:**
   - Make sure there are **NO quotes** around the values
   - Make sure there are **NO spaces** before or after the `=` sign
   - The URL should start with `https://`
   - Keep the `NEXT_PUBLIC_` prefix - it's required!

3. **Optional: Add Site URL (for email redirects)**
   
   If you want email verification links to work properly, also add:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   For production, change this to your actual domain:
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

## Step 4: Verify Your Setup

Your final `.env.local` file should look something like this:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 5: Save and Verify

1. **Save the file** (Ctrl+S or Cmd+S)
2. **Restart your development server** if it's already running:
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again
   - The environment variables will be loaded on server start

## Important Security Notes

- ✅ **DO commit `.env.example`** - It's safe, contains no secrets
- ❌ **DO NOT commit `.env.local`** - It contains your secrets!
- ✅ `.env.local` is already in `.gitignore` (should be automatically ignored by Git)

## Troubleshooting

### The file doesn't show up in my editor
- Make sure you're in the project root directory
- Some editors hide files starting with `.` - check your editor settings
- Try typing `.env.local` directly in the file open dialog

### "Module not found" or import errors after setup
- Make sure you restarted the dev server after creating `.env.local`
- Verify the file is named exactly `.env.local` (not `.env.local.txt`)
- Check that there are no extra spaces or quotes in your values

### Still can't find Supabase credentials
- Make sure you're looking at the **API** section, not Authentication
- The **anon public** key is different from the **service_role** key (use the anon one!)
- If you still can't find it, go to: Project Settings → API → Project API keys

## Next Steps

After setting up your environment variables:
1. Restart your development server: `npm run dev`
2. Try signing up a test user
3. Test creating a car listing
4. Verify everything works!

If you run into any issues, check the browser console and terminal for error messages.
