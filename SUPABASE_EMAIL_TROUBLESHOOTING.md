# Supabase Email Confirmation Troubleshooting Guide

## Issue: "Error sending confirmation email" on Signup

If you're seeing this error when users try to sign up, here are the common causes and solutions:

## Common Causes

### ⚠️ **MOST COMMON: Personal SMTP Provider Warning**
**If you see "Check your SMTP provider" warning in Supabase:**
- This means you're using a personal email service (Gmail, Outlook, etc.)
- These services are NOT designed for transactional emails
- They often block or limit automated emails
- **Solution:** Use a transactional email service (see Solution #2 below)

### 1. Email Confirmation Disabled
**Problem:** Email confirmation might be disabled in Supabase settings.

**Solution:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Check "Enable email confirmations"
3. If disabled, enable it and save

### 2. SMTP Not Configured or Using Personal Email Provider ⚠️ **COMMON ISSUE**
**Problem:** Supabase needs SMTP settings to send emails. Using personal email providers (Gmail, Outlook, etc.) can cause delivery issues.

**Warning:** If you see "Check your SMTP provider" warning in Supabase, it means you're using a personal email service that's not designed for transactional emails.

**Solution - Option A: Use Supabase's Built-in Email Service (Recommended for Development)**
1. Go to Supabase Dashboard → Project Settings → Auth
2. Scroll to "SMTP Settings"
3. **Remove or disable custom SMTP settings**
4. Use Supabase's built-in email service (works for development/testing)
5. Note: This has rate limits and is not recommended for production

**Solution - Option B: Use a Transactional Email Service (Required for Production)**
Use a proper transactional email service instead of personal email providers:

**Recommended Services:**
1. **Resend** (Recommended - Easy setup, great for Next.js)
   - Sign up at https://resend.com
   - Get API key
   - SMTP Host: `smtp.resend.com`
   - SMTP Port: `587` or `465`
   - SMTP User: `resend`
   - SMTP Password: Your Resend API key
   - Free tier: 3,000 emails/month

2. **SendGrid** (Popular, reliable)
   - Sign up at https://sendgrid.com
   - Create API key
   - SMTP Host: `smtp.sendgrid.net`
   - SMTP Port: `587`
   - SMTP User: `apikey`
   - SMTP Password: Your SendGrid API key
   - Free tier: 100 emails/day

3. **Mailgun** (Developer-friendly)
   - Sign up at https://www.mailgun.com
   - Get SMTP credentials
   - SMTP Host: `smtp.mailgun.org`
   - SMTP Port: `587`
   - Free tier: 5,000 emails/month for 3 months

4. **Amazon SES** (Cost-effective for high volume)
   - Set up through AWS
   - SMTP Host: `email-smtp.[region].amazonaws.com`
   - SMTP Port: `587`
   - Requires AWS account setup

**Steps to Configure:**
1. Sign up for one of the services above
2. Get your SMTP credentials (host, port, username, password)
3. Go to Supabase Dashboard → Project Settings → Auth → SMTP Settings
4. Enter your SMTP credentials:
   - SMTP Host
   - SMTP Port (usually 587 for TLS or 465 for SSL)
   - SMTP User
   - SMTP Password
   - Sender email (must be verified with your email service)
   - Sender name
5. Save settings
6. Test by signing up a new user

### 3. Email Templates Not Set Up
**Problem:** Email templates might not be configured.

**Solution:**
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Ensure "Confirm signup" template is configured
3. Check that the template includes:
   - Subject line
   - Email body with confirmation link
   - Proper redirect URL

### 4. Site URL Incorrect
**Problem:** The `emailRedirectTo` URL might be incorrect or not matching your site URL.

**Solution:**
1. Check your `.env.local` file has:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000  # for development
   # or
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # for production
   ```
2. In Supabase Dashboard → Authentication → URL Configuration:
   - Set "Site URL" to match your `NEXT_PUBLIC_SITE_URL`
   - Add redirect URLs if needed

### 5. Rate Limiting
**Problem:** Too many signup attempts might trigger rate limiting.

**Solution:**
- Wait a few minutes and try again
- Check Supabase Dashboard → Authentication → Rate Limits

### 6. Email Service Provider Issues
**Problem:** Your email service provider (Gmail, SendGrid, etc.) might be blocking emails.

**Solution:**
- Check your email service provider's dashboard for errors
- Verify API keys and credentials are correct
- Check spam/junk folders
- Ensure sender email is verified with your email provider

## Current Implementation

The app now handles email errors gracefully:
- If the user account is created but email fails, it shows a success message with a warning
- Users can still sign in even if confirmation email wasn't sent
- The error is logged in the console for debugging

## Testing Email Configuration

1. **Test in Development:**
   - Use Supabase's built-in email service (limited)
   - Check Supabase Dashboard → Authentication → Users for new signups
   - Check email logs in Supabase Dashboard

2. **Test in Production:**
   - Ensure SMTP is properly configured
   - Test with a real email address
   - Check spam folders
   - Verify email templates are set up

## Quick Fixes

### Option 1: Use Supabase Built-in Email (Development Only)

For development/testing, you can use Supabase's built-in email service:

1. Go to Supabase Dashboard → Project Settings → Auth → SMTP Settings
2. **Remove/clear any custom SMTP settings** (leave it empty)
3. Supabase will use its built-in service
4. Note: Limited to development, has rate limits

### Option 2: Disable Email Confirmation (Development Only)

If you just want to test signup without emails:

1. Go to Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations"
3. Users can sign in immediately after signup

**Note:** This is NOT recommended for production. Always enable email confirmation in production.

### Option 3: Use Resend (Recommended - Easiest Setup)

Resend is the easiest transactional email service to set up:

1. **Sign up:** Go to https://resend.com and create a free account
2. **Get API key:** Dashboard → API Keys → Create API Key
3. **Verify domain** (optional for testing, required for production)
4. **Configure in Supabase:**
   - Go to Supabase Dashboard → Project Settings → Auth → SMTP Settings
   - SMTP Host: `smtp.resend.com`
   - SMTP Port: `587`
   - SMTP User: `resend`
   - SMTP Password: Your Resend API key
   - Sender email: Use a verified email from Resend
   - Sender name: Your app name
5. **Save and test**

## Verification Steps

After configuring email settings:

1. Try signing up with a test account
2. Check the email inbox (and spam folder)
3. Check Supabase Dashboard → Authentication → Users
4. Check browser console for detailed error logs
5. Check Supabase Dashboard → Logs → Auth Logs

## Password reset: "Success" shown but no email received

If the forgot-password form shows a success message but the user never receives the reset email:

### 1. Allowlist the auth callback URL (most common)

The app sends the reset link to **your auth callback URL**. Supabase will not send the email (or may use the wrong link) if that URL is not allowlisted.

**Fix:**
1. Go to **Supabase Dashboard → Authentication → URL Configuration**.
2. Under **Redirect URLs**, add **exactly** (so the link in the email goes here and you get the set-password page):
   - For local: `http://localhost:3000/auth/callback`
   - For production: `https://kuldae.com/auth/callback` (or your production domain)
   - Or use a wildcard: `http://localhost:3000/**` and `https://yourdomain.com/**`
3. Ensure **Site URL** matches your app (e.g. `http://localhost:3000` for dev, `https://yourdomain.com` for prod).

**If you still land on the sign-in page:** The reset link may be pointing at a different path (e.g. `/dashboard` or `/login`). Where the link goes is decided by the allowlisted URL Supabase uses. Add `https://yourdomain.com/auth/callback` to Redirect URLs and ensure the **Reset password** email template uses `{{ .ConfirmationURL }}` so the link uses that path. You can check the real link by right‑clicking “Reset Password” in the email → Copy link and inspecting the URL.

### 2. Use the redirect in the reset email template

If the link in the email ignores your `redirectTo` and uses the default Site URL, the link may point to the wrong path.

**Fix:**
1. Go to **Supabase Dashboard → Authentication → Email Templates**.
2. Open the **Reset password** template.
3. Ensure the confirmation link uses `{{ .ConfirmationURL }}` (it includes the redirect). If the template uses a custom link with only `{{ .SiteURL }}`, change it so the button/link uses `{{ .ConfirmationURL }}`.

### 3. Other checks

- **SMTP / rate limits:** Same as signup (see sections above). Use a transactional provider in production.
- **Spam folder:** Ask the user to check spam/junk.
- **Correct email:** The message says "if an account exists" — confirm the email has an account in Supabase Dashboard → Authentication → Users.

## Supabase log: "One-time token not found" / "403: Email link is invalid or has expired"

If Supabase Auth logs show this when the user clicks the password reset link:

- **Cause:** The one-time token in the link was already used or has expired. Common causes:
  1. **Email link scanning** – Gmail, Outlook, and other clients often prefetch or “scan” links when you open the email. That first request uses the token, so when the user clicks the link, Supabase no longer has it.
  2. **Link used twice** – Opening the same reset link in two tabs or clicking it again after a refresh.
  3. **Expiry** – Recovery tokens expire (often within an hour); old links will fail.

**What to do:**

1. **Request a new reset** from the Forgot password page (so a new token is created).
2. **Do not click the link in the email.** Right‑click the “Reset password” link → **Copy link**.
3. **Open a new incognito or private browser window** and **paste the link** into the address bar, then press Enter.
4. Use the link **within a few minutes** of requesting the reset.

The app’s recovery page also shows these steps when a link is invalid. Ensure users always request the reset from the app’s Forgot password page (so the reset is triggered from the browser and PKCE works correctly).

### "400: code challenge does not match previously saved code verifier" (path `/token`)

The reset was **requested** in one place (e.g. production) but the **link was opened** in another (e.g. localhost or a different browser). PKCE requires the **same browser and same site** for both steps. Request the reset and open the link on the same origin (e.g. both on localhost, or both on production). Do not mix.

## Need More Help?

- Check Supabase Documentation: https://supabase.com/docs/guides/auth/auth-email
- Check Supabase Dashboard → Logs for detailed error messages
- Review server logs in your application console
