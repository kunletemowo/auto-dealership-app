# Fix: Environment Variables for ALL Environments

## The Problem

Your logs show environment variables are missing because:
- You're testing a **Preview deployment** (`auto-dealership-kvr57u...`)
- But your environment variables are likely only set for **Production**

## The Solution

Set environment variables for **ALL** environments (Production, Preview, AND Development).

---

## Step-by-Step Fix

### 1. Edit Each Environment Variable

For **EACH** of these variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (optional)

**Do this:**

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

2. **Click the ⋯ (three dots) menu** next to `NEXT_PUBLIC_SUPABASE_URL`

3. **Click "Edit"**

4. **Under "Environment" section**, check ALL THREE boxes:
   - ✅ **Production**
   - ✅ **Preview** 
   - ✅ **Development**

5. **Click "Save"**

6. **Repeat steps 2-5 for** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

7. **Repeat steps 2-5 for** `NEXT_PUBLIC_SITE_URL` (if you have it)

### 2. Redeploy

After setting variables for all environments:

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click **⋯ → Redeploy**
4. Wait for it to complete

### 3. Test

- If testing Preview: Use the preview URL (like `auto-dealership-kvr57u...`)
- If testing Production: Use `auto-dealership-app.vercel.app`

Both should now work!

---

## Why This Happens

Vercel has three environments:
- **Production** - Your main domain (`auto-dealership-app.vercel.app`)
- **Preview** - Branch/PR deployments (`auto-dealership-kvr57u...`)
- **Development** - Local development

Environment variables are **separate** for each environment. If you only set them for Production, Preview deployments won't have access to them.

---

## Verification

After redeploying, check the logs again:
- The error `hasUrl: false, hasKey: false` should be gone
- You should see successful authentication attempts
- The "Supabase environment variables are missing" warnings should stop

---

**Remember:** Always set environment variables for ALL environments unless you have a specific reason not to! 🚀
