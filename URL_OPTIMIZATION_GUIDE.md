# URL optimization guide

This guide explains how to show users cleaner URLs instead of deployment details and internal IDs.

---

## Where to find Vercel environment variables

If your domain is already added in Vercel, set **NEXT_PUBLIC_SITE_URL** and other env vars so the app uses your domain in links, sitemaps, and metadata.

**Steps:**

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Open your **team** (or personal account) and select the **project** (e.g. auto-dealership-app).
3. In the project, open the **Settings** tab (top navigation).
4. In the left sidebar, click **Environment Variables**.
5. You’ll see a table of variables. To add one:
   - **Key:** e.g. `NEXT_PUBLIC_SITE_URL`
   - **Value:** your production URL, e.g. `https://yourdomain.com` or `https://www.yourdomain.com` (no trailing slash)
   - **Environments:** check **Production** (and **Preview** if you want preview deployments to use it).
   - Click **Save**.
6. Redeploy the project (e.g. **Deployments** → open latest → **Redeploy**) so the new variables are applied. Env vars are baked in at build time.

**Variables to set for this app:**

| Key | Example value | Purpose |
|-----|----------------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Base URL for sitemap, canonicals, Open Graph, JSON-LD |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL (if not set) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon key (if not set) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | For admin/seller email; optional but recommended |

---

## 1. Use a custom domain (recommended)

**Issue:** The default Vercel URL looks like:
`https://auto-dealership-9q845ui1w-kunletemowo-5267s-projects.vercel.app/cars/...`

**Fix:** Use your own domain so users see:
`https://yourdomain.com/cars/...` or `https://www.yourdomain.com/cars/...`

**Steps:**
1. In **Vercel Dashboard** → your project → **Settings** → **Domains**.
2. Add your domain (e.g. `kuldaeautos.com` or `www.kuldaeautos.com`).
3. Follow Vercel’s instructions to add the required DNS records at your registrar.
4. After DNS propagates, Vercel will serve the app on your domain. Use this domain in **Production** so users and search engines see it.
5. Set **NEXT_PUBLIC_SITE_URL** (and in Vercel env vars) to `https://yourdomain.com` so metadata, sitemaps, and canonicals use the correct base URL.

Preview deployments will still use the long `*.vercel.app` URL unless you add a custom domain for previews too.

---

## 2. Remove `/app/` from the path (if present)

**Issue:** URLs look like `https://.../app/cars/...` and you want `https://.../cars/...`.

**Possible causes and fixes:**

- **basePath in Next.js**  
  If `next.config.ts` (or `next.config.js`) has `basePath: '/app'`, remove it so routes are at the root.

- **Vercel “Root Directory”**  
  If the project is in a subfolder (e.g. `apps/web`) and Vercel is set to that folder, the URL usually does **not** get an `/app` prefix. If you see `/app` in the browser, check:
  - **Vercel** → **Settings** → **General** → **Root Directory**  
  Set it to the directory that contains your Next.js app (e.g. `.` or `apps/auto-dealership`), not a path that would be exposed as a URL segment.

- **Rewrites / proxy**  
  If you use rewrites that add an `/app` prefix, adjust or remove them so the public path is `/cars/...`.

After this, the path should be `/cars/<id>` with no `/app` in front.

---

## 3. Slug-based car URLs (implemented)

Car detail URLs can use a readable slug instead of the raw UUID, e.g.  
`/cars/2022-mazda-cx5-mississauga-a1b2c3d4` instead of  
`/cars/93afe03d-f2a2-4280-aa6e-21b1184f67da`.

### Step 1: Add the `slug` column in Supabase

1. Open **Supabase Dashboard** → your project → **SQL Editor**.
2. Run the migration script **ADD_SLUG_TO_CAR_LISTINGS.sql** (in the project root). It:
   - Adds a nullable, unique `slug` column to `car_listings`.
   - Backfills slugs for existing rows (from title + short id).
   - Optionally sets the column to NOT NULL and adds an index after backfill.

If you prefer to run SQL manually:

```sql
-- Add slug column
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Backfill: set slug for existing rows (run once; format: slugify(title)-first8chars(id))
-- Example function you can call per row or in a trigger:
-- slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(id::text, 8)
```

Then run the full **ADD_SLUG_TO_CAR_LISTINGS.sql** from the repo to match the app’s slug format.

### Step 2: What the app does (already implemented)

- **Slug generation:** When a listing is created or updated, the app generates a slug from the title and the listing id (e.g. `2022-mazda-cx5-a1b2c3d4`) and saves it in `car_listings.slug`.
- **Resolving:** The car detail route accepts either a **slug** or a **UUID** in the path:
  - ` /cars/2022-mazda-cx5-mississauga-a1b2c3d4` → lookup by slug.
  - ` /cars/93afe03d-f2a2-4280-aa6e-21b1184f67da` → lookup by id (still works); the page redirects to the canonical slug URL when a slug exists.
- **Links:** Listing cards, sitemap, and post-create redirects use the slug when present, so new links are human-readable. Old UUID links keep working and redirect to the slug URL.

### Step 3: After running the migration

- **New listings** get a slug automatically.
- **Existing listings** get a slug from the backfill in the SQL script.
- Visit a car page by UUID; you should be redirected to the same page with the slug in the URL.
- Ensure **NEXT_PUBLIC_SITE_URL** is set in Vercel (see “Where to find Vercel environment variables” above) so canonicals and sitemaps use your domain.
