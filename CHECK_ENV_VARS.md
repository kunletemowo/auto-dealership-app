# Check Your Environment Variables

The "Invalid API key" error means your Supabase credentials are missing or incorrect.

## Required Environment Variables

Your `.env.local` file MUST have these two variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## How to Fix:

### Step 1: Check Your .env.local File

1. Open `.env.local` in your project root
2. Make sure you have BOTH variables above
3. Make sure there are NO spaces around the `=` sign
4. Make sure there are NO quotes around the values

### Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ⚠️ Make sure it's the **anon public** key, NOT the service_role key!

### Step 3: Update .env.local

Your `.env.local` should look like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTE5MjgwMCwiZXhwIjoxOTYwNzY4ODAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Restart Your Dev Server

**IMPORTANT:** After updating `.env.local`, you MUST restart your dev server:

1. Stop the server (Ctrl+C in terminal)
2. Start it again: `npm run dev`

Environment variables are only loaded when the server starts!

### Step 5: Verify

1. Try logging in again
2. If you still get "Invalid API key", double-check:
   - The anon key starts with `eyJ...`
   - The URL starts with `https://` and ends with `.supabase.co`
   - No extra spaces or quotes
   - Dev server was restarted

## Common Mistakes:

❌ **Wrong:** `NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJ..."` (spaces and quotes)
✅ **Correct:** `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...` (no spaces, no quotes)

❌ **Wrong:** Using service_role key instead of anon key
✅ **Correct:** Use the **anon public** key for authentication

❌ **Wrong:** Not restarting dev server after changing .env.local
✅ **Correct:** Always restart after changing environment variables
