# Setting Up Environment Variables in Vercel

This guide shows you how to get your environment variable keys from your `.env.local` file and add them to Vercel.

## Step 1: Identify Required Environment Variables

Your application uses the following environment variables:

### Required Variables:
1. **`NEXT_PUBLIC_SUPABASE_URL`** - Your Supabase project URL
2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** - Your Supabase anonymous/public API key

### Optional Variables:
3. **`NEXT_PUBLIC_SITE_URL`** - Your site URL (for email redirects, defaults to `http://localhost:3000`)

## Step 2: Get Values from Your .env.local File

1. **Open your `.env.local` file** in your project root directory
   - If you don't see it, enable "Show hidden files" in your file explorer/editor
   - The file should be located at: `auto-dealership-app/.env.local`

2. **Copy the values** - Your file should look something like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourprojectid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note:** 
- Copy the **entire value** after the `=` sign
- Do NOT include quotes if they exist
- For production, update `NEXT_PUBLIC_SITE_URL` to your Vercel domain (e.g., `https://your-app.vercel.app`)

## Step 3: Add Environment Variables to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Log in to your account

2. **Select Your Project**
   - Click on your project name (auto-dealership-app)

3. **Navigate to Settings**
   - Click on the **Settings** tab at the top
   - Click on **Environment Variables** in the left sidebar

4. **Add Each Variable**
   
   For **NEXT_PUBLIC_SUPABASE_URL**:
   - Click **Add New**
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste your Supabase URL (e.g., `https://xxxxx.supabase.co`)
   - **Environment**: Select all environments (Production, Preview, Development)
   - Click **Save**

   For **NEXT_PUBLIC_SUPABASE_ANON_KEY**:
   - Click **Add New** again
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase anon key (the long JWT token)
   - **Environment**: Select all environments (Production, Preview, Development)
   - Click **Save**

   For **NEXT_PUBLIC_SITE_URL** (Optional but recommended):
   - Click **Add New**
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - **Environment**: Select **Production** only (or all if you want)
   - Click **Save**

5. **Redeploy Your Application**
   - After adding environment variables, you need to redeploy
   - Go to the **Deployments** tab
   - Click the **⋯** (three dots) menu on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a new deployment

### Method 2: Via Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Pull environment variables to verify
vercel env pull .env.local
```

## Step 4: Verify Environment Variables

1. **Check in Vercel Dashboard**
   - Go to Settings → Environment Variables
   - Verify all three variables are listed

2. **Check in Deployment Logs**
   - Go to Deployments tab
   - Click on a deployment
   - Check the build logs to ensure no environment variable errors

3. **Test Your Application**
   - Visit your deployed Vercel URL
   - Test authentication and database connections
   - Check browser console for any errors

## Important Notes

### Environment Variable Naming
- **`NEXT_PUBLIC_` prefix is required** for variables that need to be accessible in the browser
- Variables without this prefix are only available on the server side

### Security
- **Never commit `.env.local` to Git** - it's already in `.gitignore`
- The `anon` key is safe to expose in the browser (it's public)
- Never use the `service_role` key in client-side code

### Production vs Development
- For **Production**: Use your actual Vercel domain in `NEXT_PUBLIC_SITE_URL`
- For **Development**: Keep `http://localhost:3000` or your local dev URL

## Troubleshooting

### Variables Not Working?
1. **Redeploy** after adding variables (they don't apply to existing deployments)
2. **Check spelling** - variable names are case-sensitive
3. **Verify values** - make sure you copied the entire value without extra spaces
4. **Check environment selection** - ensure variables are added to the correct environment (Production/Preview/Development)

### Where to Get Supabase Credentials
If you need to get your Supabase credentials again:
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

## Quick Reference

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | `https://your-app.vercel.app` |

---

**Need Help?** Check the Vercel documentation: [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
