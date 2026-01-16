# Configure Authentication Service in Vercel - Quick Guide

Your authentication is failing in production because the environment variables from your `.env.local` file are **NOT** automatically available in Vercel. You need to add them manually in the Vercel dashboard.

## ✅ Your Current Environment Variables (from .env.local)

Here are the values you need to add to Vercel:

- **NEXT_PUBLIC_SUPABASE_URL**: `https://gmpjblzzjaezjopxqedz.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcGpibHp6amFlempvcHhxZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzk3ODAsImV4cCI6MjA4Mzc1NTc4MH0.O9GQOdnjmvf00uWMaz5WmwZrpgsIwaMuRqK_2jLqqII`
- **NEXT_PUBLIC_SITE_URL**: Should be your Vercel production URL (e.g., `https://auto-dealership-app.vercel.app`)

---

## 📋 Step-by-Step Instructions to Add to Vercel

### Step 1: Go to Your Vercel Project

1. Visit: **https://vercel.com/dashboard**
2. Log in to your Vercel account
3. Click on your project: **auto-dealership-app** (or your project name)

### Step 2: Navigate to Environment Variables

1. Click on the **Settings** tab at the top
2. In the left sidebar, click on **Environment Variables**

### Step 3: Add NEXT_PUBLIC_SUPABASE_URL

1. Click **Add New** button
2. Fill in:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://gmpjblzzjaezjopxqedz.supabase.co`
   - **Environment**: Select **Production**, **Preview**, and **Development** (check all three)
3. Click **Save**

### Step 4: Add NEXT_PUBLIC_SUPABASE_ANON_KEY

1. Click **Add New** button again
2. Fill in:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcGpibHp6amFlempvcHhxZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzk3ODAsImV4cCI6MjA4Mzc1NTc4MH0.O9GQOdnjmvf00uWMaz5WmwZrpgsIwaMuRqK_2jLqqII`
   - **Environment**: Select **Production**, **Preview**, and **Development** (check all three)
3. Click **Save**

### Step 5: Add NEXT_PUBLIC_SITE_URL

1. Click **Add New** button again
2. Fill in:
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: Your Vercel production domain (find it in your Vercel project settings, usually something like `https://auto-dealership-app.vercel.app`)
   - **Environment**: Select **Production** (you can also select all if you want)
3. Click **Save**

### Step 6: Redeploy Your Application

**⚠️ IMPORTANT:** Environment variables only apply to **NEW** deployments. You must redeploy after adding them.

**Option A: Redeploy via Dashboard**
1. Go to the **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu on the right
4. Click **Redeploy**
5. Confirm the redeploy

**Option B: Redeploy via Git Push**
1. Make a small change to any file (e.g., add a comment)
2. Commit and push to your Git repository
3. Vercel will automatically deploy with the new environment variables

---

## ✅ Verify Configuration

After redeploying:

1. **Check Deployment Logs**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Check that the build succeeded
   - Look for any environment variable errors

2. **Test Authentication**
   - Visit your production site
   - Try to sign up or sign in
   - The "Authentication service is not configured" error should be gone

---

## 🔍 Troubleshooting

### Still Getting the Error?

1. **Did you redeploy?** - Environment variables don't apply to existing deployments
2. **Check spelling** - Variable names are case-sensitive:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ❌ `NEXT_PUBLIC_SUPABASE_url` (wrong)
3. **Check environments** - Make sure you selected **Production** environment
4. **Check values** - Make sure you copied the entire value without extra spaces

### How to Verify Variables Are Set

1. Go to **Settings** → **Environment Variables** in Vercel
2. You should see all three variables listed:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

### Find Your Production URL

1. Go to your Vercel project dashboard
2. Look at the top - you'll see your deployment URL
3. Or go to **Settings** → **Domains** to see all your domains

---

## 🎯 Quick Checklist

- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Added `NEXT_PUBLIC_SITE_URL` to Vercel (with production URL)
- [ ] Selected **Production** environment for all variables
- [ ] Redeployed the application
- [ ] Tested sign up/sign in in production

---

Once you complete these steps, authentication should work in production! 🚀
