# How to Redeploy After Adding Environment Variables in Vercel

## ⚠️ Critical: Environment Variables Only Apply to NEW Deployments

When you add or update environment variables in Vercel, **they are NOT automatically applied to your existing deployment**. You **MUST** redeploy for them to take effect.

---

## Step-by-Step: Redeploy Your Application

### Method 1: Redeploy from Vercel Dashboard (Recommended)

1. **Go to Your Vercel Project Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **Navigate to Deployments Tab**
   - Click on **"Deployments"** at the top navigation

3. **Find Your Latest Deployment**
   - You'll see a list of all deployments
   - The most recent one should be at the top

4. **Redeploy**
   - Hover over the latest deployment row
   - Click the **"⋯"** (three dots) menu on the right side
   - Select **"Redeploy"** from the dropdown menu
   - Confirm the redeploy

5. **Wait for Deployment to Complete**
   - Watch the build progress
   - Wait for the status to show "Ready" (usually takes 1-3 minutes)

6. **Test Your Application**
   - After deployment completes, visit your production site
   - Try to sign up or sign in
   - The error should be gone!

### Method 2: Trigger Deployment via Git Push

If you prefer to trigger a deployment through Git:

1. **Make a Small Change** (optional - just to trigger a deployment)
   - Edit any file (e.g., add a comment to `src/app/page.tsx`)
   - Or create an empty commit

2. **Commit and Push**
   ```bash
   git add .
   git commit -m "Trigger redeploy with env vars"
   git push
   ```

3. **Wait for Deployment**
   - Vercel will automatically build and deploy
   - Check the Deployments tab to see progress

---

## ✅ Verify Environment Variables Are Set Correctly

Before redeploying, double-check your environment variables in Vercel:

1. **Go to Settings → Environment Variables**
2. **Click the eye icon** 👁️ next to each variable to view its value
3. **Verify:**
   - `NEXT_PUBLIC_SUPABASE_URL` should start with `https://` and end with `.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be a long string starting with `eyJ...`
   - Both should NOT be empty

### Common Issues:

❌ **Empty Values:**
   - If a variable shows as `************` but you can't see the actual value
   - Click the eye icon to reveal and verify it's not just empty spaces

❌ **Wrong Variable Name:**
   - Must be exactly: `NEXT_PUBLIC_SUPABASE_URL` (not `NEXT_PUBLIC_SUPABASE_url`)
   - Case-sensitive!

❌ **Wrong Environment Selected:**
   - Make sure **Production** is checked for both variables
   - You can select all three (Production, Preview, Development)

---

## 🔍 Verify After Redeployment

After redeploying, you can check if environment variables are being read:

1. **Check Deployment Logs:**
   - Go to Deployments → Latest deployment
   - Click on the deployment
   - Check "Build Logs" or "Function Logs"
   - Look for any errors about missing environment variables

2. **Test Authentication:**
   - Visit your production site
   - Try to sign up or sign in
   - If you still get the error, check the Vercel deployment logs for the error message

3. **Check Vercel Function Logs:**
   - In your deployment, go to "Functions" tab
   - Look for any error logs that mention "Missing Supabase env vars"
   - These logs will show what the server sees

---

## 🚨 Still Not Working?

If you've redeployed and still get the error:

### 1. Verify Values Are Correct
- Click the eye icon 👁️ next to each variable in Vercel
- Make sure the values match what's in your `.env.local` file (except for `NEXT_PUBLIC_SITE_URL` which should be your production URL)

### 2. Check for Hidden Characters
- Copy the values from Vercel
- Paste them in a text editor
- Check for any invisible characters or extra spaces
- Re-enter them if needed

### 3. Delete and Re-add Variables
- Sometimes Vercel has issues with updated variables
- Delete the variable from Vercel
- Add it again with the correct value
- Redeploy

### 4. Check Deployment Build Logs
- Go to your deployment in Vercel
- Check the "Build Logs" or "Runtime Logs"
- Look for any errors or warnings about environment variables

### 5. Contact Vercel Support
- If nothing works, there might be a Vercel-specific issue
- Contact Vercel support with your deployment ID and the issue

---

## Quick Checklist

Before redeploying, make sure:
- [ ] Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist in Vercel
- [ ] Both have **Production** environment selected
- [ ] Both have non-empty values (use eye icon to verify)
- [ ] Variable names are spelled correctly (case-sensitive)
- [ ] No extra spaces or quotes around values

After redeploying:
- [ ] Deployment shows "Ready" status
- [ ] Try signing up/signing in on production site
- [ ] Check deployment logs for any errors

---

**Remember:** Every time you add or update environment variables in Vercel, you MUST redeploy for them to take effect! 🚀
