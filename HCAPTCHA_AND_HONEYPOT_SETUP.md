# hCaptcha and Honeypot Setup Guide

Step-by-step instructions to activate hCaptcha and install the honeypot for bot protection on your auto-dealership app.

---

## Part 1: Activate hCaptcha in Supabase

### Step 1: Sign up for hCaptcha and get both keys

1. Go to [https://www.hcaptcha.com/](https://www.hcaptcha.com/) and create an account (free tier available)
2. **Site key** – From the **Sites** tab:
   - Go to [https://dashboard.hcaptcha.com/sites](https://dashboard.hcaptcha.com/sites)
   - Click **Add Site** or open an existing site
   - Copy the **Site Key** (used in your frontend / `.env.local`)

3. **Secret key** – From the **Settings** tab:
   - Click your **profile icon** (top right) → **Settings**
   - Or go to [https://dashboard.hcaptcha.com/settings](https://dashboard.hcaptcha.com/settings)
   - Copy the **Secret key** (used only in Supabase, never in your app code)
   - If you don’t see one: click **Generate New Secret** and copy it immediately (it’s shown only once)

**Summary:** You need both keys. The **Site key** is per site; the **Secret key** is per account and shared across all sites.

### Step 2: Enable CAPTCHA in Supabase Dashboard

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Bot and Abuse Protection** (or **Auth** → **Providers** → **Bot and Abuse Protection**)
4. Turn **ON** "Enable Captcha protection"
5. Choose **hCaptcha** from the "Choose Captcha Provider" dropdown
6. Paste your **Secret key** into the "Captcha secret" field
7. Click **Save changes**

### Step 3: Add your Sitekey to the app

1. Add this to your `.env.local` file:
   ```
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_sitekey_here
   ```
2. Replace `your_sitekey_here` with the **Sitekey** from hCaptcha
3. Restart your dev server: `npm run dev`

### Step 4: Install the hCaptcha package

The package is already in `package.json`. Run in your project directory:
```bash
npm install
```

### Step 5: Verify hCaptcha is working

1. Go to the sign-up page (`/register`)
2. You should see an hCaptcha checkbox above the "Create Account" button
3. Complete the challenge and submit the form
4. Registration should succeed if hCaptcha verifies

**Local testing:** hCaptcha may not work on `localhost` by default. Options:
- Add `localhost` to your hCaptcha site's allowed domains in the hCaptcha dashboard
- Use [ngrok](https://ngrok.com/) to expose your local app via a public URL
- Or use the hCaptcha "Pass" (invisible) mode for testing if configured

---

## Part 2: Honeypot Installation

The honeypot is already implemented in the registration form. Here's how it works:

### What it does

1. A hidden field named `website` is added to the sign-up form
2. It is hidden with CSS (invisible to users, but still in the DOM)
3. Bots often fill every form field, including hidden ones
4. If the honeypot field has any value, the sign-up is rejected
5. The user sees a generic "error" message (we don't reveal we detected a bot)

### Where it's implemented

- **RegisterForm.tsx:** Hidden input + client-side check before submit
- **auth.ts (signUp action):** Server-side check before calling Supabase

### Optional: Add to Login form

If you want honeypot protection on the login form as well, add the same hidden field and server-side check to `LoginForm.tsx` and the `signIn` action.

---

## Troubleshooting

### "CAPTCHA verification failed"
- Ensure `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is set correctly in `.env.local`
- Check that the Secret key in Supabase matches your hCaptcha account
- Verify your domain is allowed in hCaptcha Settings

### hCaptcha not showing
- Confirm `@hcaptcha/react-hcaptcha` is installed
- Check the browser console for errors
- Ensure the Sitekey is loaded (no typos in env var name)

### Honeypot blocking real users
- Real users should never see or fill the honeypot
- If a user reports they can't sign up, check if they're using an autofill extension that fills all fields
- The honeypot field uses `tabIndex={-1}` and `aria-hidden="true"` so it's skipped by screen readers and keyboard navigation

---

## Summary Checklist

- [ ] hCaptcha account created
- [ ] Sitekey and Secret key copied
- [ ] CAPTCHA enabled in Supabase Dashboard
- [ ] Secret key entered in Supabase
- [ ] `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` added to `.env.local`
- [ ] `npm install @hcaptcha/react-hcaptcha` run
- [ ] Dev server restarted
- [ ] Honeypot already in code (no extra steps)
- [ ] Sign-up tested successfully
