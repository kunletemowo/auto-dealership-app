# Resend SMTP Setup for Supabase

## Quick Setup Guide

If you're still getting "Error sending confirmation email" after configuring Resend, follow these steps:

## Step 1: Verify Resend Configuration

1. **Check Resend Dashboard:**
   - Go to https://resend.com/dashboard
   - Verify your API key is active
   - Check if you have any domain verification issues

2. **Verify SMTP Settings in Supabase:**
   - Go to Supabase Dashboard → Project Settings → Auth → SMTP Settings
   - Verify all fields are filled correctly:
     - **SMTP Host:** `smtp.resend.com`
     - **SMTP Port:** `587` (or `465` for SSL)
     - **SMTP User:** `resend`
     - **SMTP Password:** Your Resend API key (starts with `re_`)
     - **Sender Email:** Must be a verified email in Resend
     - **Sender Name:** Your app name (e.g., "Kuldae Autos")

## Step 2: Verify Resend API Key

1. **Get your API key:**
   - Go to Resend Dashboard → API Keys
   - Copy your API key (it starts with `re_`)
   - Make sure it's the full key, not truncated

2. **Test the API key:**
   - The API key should be pasted exactly as shown in Resend
   - No spaces before or after
   - No quotes around it

## Step 3: Verify Sender Email

**Important:** The sender email must be verified in Resend:

1. **For Testing (No Domain Verification):**
   - Use a personal email that you can verify
   - Go to Resend Dashboard → Domains → Add Domain (or use default)
   - Verify the email address

2. **For Production:**
   - Add and verify your domain in Resend
   - Use an email from that domain (e.g., `noreply@yourdomain.com`)

## Step 4: Common Issues and Fixes

### Issue: "Error sending confirmation email" still appears

**Possible Causes:**

1. **API Key Incorrect:**
   - Double-check the API key in Supabase matches Resend
   - Make sure there are no extra spaces
   - Try regenerating the API key in Resend

2. **Sender Email Not Verified:**
   - The sender email must be verified in Resend
   - Check Resend Dashboard → Domains/Emails
   - Verify the email address

3. **SMTP Port Wrong:**
   - Try port `587` (TLS) first
   - If that doesn't work, try `465` (SSL)
   - Make sure the port matches the encryption type

4. **Resend Account Limits:**
   - Check if you've exceeded Resend's free tier limits
   - Free tier: 3,000 emails/month
   - Check Resend Dashboard → Usage

5. **Email Templates Not Configured:**
   - Go to Supabase Dashboard → Authentication → Email Templates
   - Ensure "Confirm signup" template is set up
   - Check that the redirect URL is correct

### Issue: Emails going to spam

- Verify your domain in Resend (for production)
- Set up SPF and DKIM records
- Use a proper sender name (not just an email)

## Step 5: Test Configuration

1. **Test in Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - Try creating a test user
   - Check the logs: Dashboard → Logs → Auth Logs

2. **Test Email Sending:**
   - Sign up with a test account
   - Check your email inbox (and spam folder)
   - Check Resend Dashboard → Emails for delivery status

3. **Check Error Logs:**
   - Supabase Dashboard → Logs → Auth Logs
   - Look for SMTP-related errors
   - Check browser console for detailed error messages

## Step 6: Alternative Configuration

If Resend still doesn't work, try these alternatives:

### Option A: Use Supabase Built-in Email (Development)
- Remove all SMTP settings in Supabase
- Use Supabase's built-in email service
- Limited to development/testing

### Option B: Use SendGrid
- Sign up at https://sendgrid.com
- SMTP Host: `smtp.sendgrid.net`
- SMTP Port: `587`
- SMTP User: `apikey`
- SMTP Password: Your SendGrid API key

### Option C: Disable Email Confirmation (Development Only)
- Go to Supabase Dashboard → Authentication → Settings
- Disable "Enable email confirmations"
- Users can sign in immediately (NOT recommended for production)

## Verification Checklist

- [ ] Resend account created and active
- [ ] API key copied correctly (starts with `re_`)
- [ ] SMTP Host set to `smtp.resend.com`
- [ ] SMTP Port set to `587` (or `465`)
- [ ] SMTP User set to `resend`
- [ ] SMTP Password is your Resend API key
- [ ] Sender email is verified in Resend
- [ ] Sender name is set
- [ ] Email templates configured in Supabase
- [ ] Site URL matches in Supabase settings
- [ ] Tested signup and checked email inbox

## Still Having Issues?

1. **Check Supabase Logs:**
   - Dashboard → Logs → Auth Logs
   - Look for specific SMTP error messages

2. **Check Resend Dashboard:**
   - Go to Resend Dashboard → Emails
   - See if emails are being sent
   - Check for delivery errors

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check Console tab for error messages
   - Look for detailed error information

4. **Verify Environment Variables:**
   - Check `.env.local` has correct values
   - Restart development server after changes

## Need Help?

- Resend Documentation: https://resend.com/docs
- Supabase Auth Docs: https://supabase.com/docs/guides/auth/auth-email
- Check error messages in Supabase Dashboard → Logs
