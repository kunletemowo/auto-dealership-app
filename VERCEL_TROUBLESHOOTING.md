# Troubleshooting Internal Server Error on Vercel

If you're getting an "Internal Server Error" on your Vercel deployment, follow these steps to diagnose and fix the issue.

## Step 1: Check Vercel Deployment Logs

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Check Deployment Logs**
   - Click on the **Deployments** tab
   - Click on the latest deployment
   - Scroll down to see the **Build Logs** and **Function Logs**
   - Look for any error messages or stack traces

3. **Check Runtime Logs**
   - In the deployment page, look for **Runtime Logs** or **Function Logs**
   - These will show errors that occur when users visit your site

## Step 2: Verify Environment Variables

The most common cause of Internal Server Error is missing environment variables.

1. **Go to Project Settings**
   - Click **Settings** → **Environment Variables**

2. **Verify These Variables Exist:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (optional but recommended)

3. **Check Values Are Correct:**
   - Make sure values don't have extra spaces or quotes
   - Verify the Supabase URL starts with `https://`
   - Ensure the anon key is the full JWT token

4. **Redeploy After Adding Variables**
   - Environment variables only apply to NEW deployments
   - Go to **Deployments** → Click **⋯** on latest deployment → **Redeploy**

## Step 3: Check Supabase Connection

1. **Verify Supabase Project is Active**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Make sure your project is not paused
   - Check that your project URL matches what's in Vercel

2. **Test Database Connection**
   - In Supabase dashboard, go to **Table Editor**
   - Verify your tables exist (profiles, car_listings, car_images)

3. **Check API Keys**
   - Go to **Settings** → **API**
   - Verify you're using the **anon public** key (not service_role)

## Step 4: Common Issues and Fixes

### Issue: Missing Environment Variables
**Symptoms:** Error in logs about `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` being undefined

**Fix:**
1. Add environment variables in Vercel (see Step 2)
2. Redeploy the application

### Issue: Database Connection Error
**Symptoms:** Errors about "connection refused" or "timeout"

**Fix:**
1. Check Supabase project is not paused
2. Verify RLS policies are set up correctly
3. Check that your Supabase URL is correct

### Issue: Proxy/Middleware Error
**Symptoms:** Errors related to proxy or middleware

**Fix:**
1. Ensure `src/proxy.ts` exists (not `middleware.ts`)
2. Check that the proxy function is properly exported
3. Verify environment variables are available in the proxy

### Issue: Build Succeeds but Runtime Fails
**Symptoms:** Build completes but site shows Internal Server Error

**Fix:**
1. Check Function Logs in Vercel dashboard
2. Look for specific error messages
3. Common causes:
   - Missing environment variables
   - Database connection issues
   - Unhandled errors in server components

## Step 5: Enable Detailed Error Logging

To see more detailed errors, you can temporarily add logging:

1. **Check Vercel Function Logs**
   - Go to your deployment
   - Click on **Functions** tab
   - Check logs for specific routes

2. **Add Console Logging** (for debugging)
   - Add `console.log` statements in your server components
   - These will appear in Vercel Function Logs
   - Remove after debugging

## Step 6: Test Locally First

Before deploying, test locally to catch errors:

```bash
# Make sure you have .env.local with all variables
npm run build
npm start
# Visit http://localhost:3000
```

If it works locally but not on Vercel, it's likely an environment variable issue.

## Step 7: Check Specific Routes

The error might be on a specific page. Test these:

1. **Homepage** (`/`) - Should load without auth
2. **Cars page** (`/cars`) - Might need database connection
3. **Login page** (`/login`) - Should work without database

If homepage works but other pages don't, check:
- Database queries in those pages
- Server actions being called
- Authentication requirements

## Quick Checklist

- [ ] Environment variables are set in Vercel
- [ ] Environment variables are added to all environments (Production, Preview, Development)
- [ ] Application has been redeployed after adding variables
- [ ] Supabase project is active and not paused
- [ ] Supabase URL and keys are correct
- [ ] No errors in Vercel deployment logs
- [ ] No errors in Vercel function logs
- [ ] Application builds successfully
- [ ] `src/proxy.ts` exists (not `middleware.ts`)

## Getting Help

If you're still stuck:

1. **Copy the exact error message** from Vercel logs
2. **Check the Function Logs** for the specific route that's failing
3. **Verify environment variables** are set correctly
4. **Test locally** to see if the issue reproduces

## Common Error Messages

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
- **Fix:** Add the environment variable in Vercel

### "Failed to fetch" or "Network error"
- **Fix:** Check Supabase project is active and URL is correct

### "Invalid API key"
- **Fix:** Verify you're using the anon key, not service_role key

### "Row Level Security policy violation"
- **Fix:** Check RLS policies in Supabase are set up correctly

---

**Need more help?** Check the Vercel documentation: [https://vercel.com/docs/deployments/troubleshoot-a-build](https://vercel.com/docs/deployments/troubleshoot-a-build)
