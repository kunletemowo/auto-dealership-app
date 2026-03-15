# PRD Implementation Checklist

**Product Requirements Document:** Auto Dealership Marketplace Platform – MVP  
**Last updated:** January 2026  
**Purpose:** Track what is done vs. outstanding per the PRD.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done – implemented and working |
| ⚠️ | Partially done or minor gap |
| ❌ | Not done / outstanding |

---

## 4.1 Authentication & User Management

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.1.1 | User Registration (First Name, Last Name, Email, Password, Confirm Password; validation; auto profile creation) | ✅ | RegisterForm + signUp action; profile created via trigger |
| 4.1.2 | User Login (Email, Password; session; redirect param; error handling) | ✅ | LoginForm + signIn; redirect supported; hCaptcha integrated |
| 4.1.3 | User Logout (clear session; redirect home; logged-out state in nav) | ✅ | signOut action; UserMenu shows Login/Sign Up when logged out |
| 4.1.4 | User Profile Management (display name, email read-only, phone, address, city, province, postal code, account type, avatar; Nominatim autocomplete; Zod; Supabase Storage for avatar) | ✅ | ProfileForm with city/province/address autocomplete (Canada); avatar upload; Zod validation |

---

## 4.2 Vehicle Listings

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.2.1 | Create Listing (all required fields; make/model autocomplete; year range; up to 10 images, 5MB each; validation; redirect to detail) | ✅ | CarListingForm; make/model from car-makes-models; image upload to Supabase Storage |
| 4.2.2 | Edit Listing (pre-populate; update all fields + images; ownership check) | ✅ | `/cars/[id]/edit` + updateCarListing action |
| 4.2.3 | Delete Listing (confirmation; ownership; cascade images; redirect dashboard; feedback) | ✅ | deleteCarListing; redirect to my-listings |
| 4.2.4 | View Listing Details (title, price, details, gallery, location, seller info, view count, Save button, contact seller) | ✅ | Car detail page; view count increment; SaveButton; ContactSeller |
| 4.2.5 | Listing Status Management (Active, Inactive, Sold, Unavailable; toggle in dashboard; only active in search) | ✅ | ListingStatusToggle on my-listings; getCarListings filters by is_active |

---

## 4.3 Search & Discovery

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.3.1 | Browse All Listings (grid; cards with image, title, price, location, details, view count; responsive; loading skeletons) | ✅ | /cars page; CarCard; Pagination; skeletons |
| 4.3.2 | Advanced Search & Filters (Search by: All, Make, Model, Title, Description, Location; make/model/province/city; distance 10–500 km; URL params; clear filters; empty state) | ✅ | CarSearchForm + AdvancedFilters; Nominatim for location; URL params; distance options |
| 4.3.3 | Sorting (Newest, Oldest, Price Low/High, Price High/Low, Year Newest/Oldest, Mileage Low/High, Mileage High/Low; URL; persists with filters) | ⚠️ | SortControls has all except **Mileage: High to Low** |
| 4.3.4 | Featured Listings on Homepage (6 latest active; grid; View All Listings; loading/empty state) | ✅ | FeaturedListings on home; limit 6; link to /cars |

---

## 4.4 Favorites / Saved Listings

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.4.1 | Save Listing to Favorites (button on detail; toggle; feedback; no duplicates; DB relationship) | ✅ | SaveButton; saveFavorite/unsaveFavorite; favorites table |
| 4.4.2 | View Saved Listings (grid; remove from favorites; only active listings shown) | ✅ | /dashboard/saved-listings; getSavedListings filters inactive |

---

## 4.5 User Dashboard

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.5.1 | My Listings Dashboard (grid; status indicators; edit/delete; status toggle; Create New Listing; sort by status/date) | ✅ | /dashboard/my-listings; ListingStatusToggle; create link to /cars/new |

---

## 4.6 Landing Page

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.6.1 | Hero Section (headline, description, **search form**: Province dropdown + City/Postal Code autocomplete + Search Cars button; CTAs: Browse Cars, Sell Your Car) | ✅ | Hero includes HeroSearchForm (Province dropdown, City/Postal Code autocomplete via Nominatim Canada, Search Cars button). Redirects to /cars with province and location filters. CTAs below: Browse Cars, List Your Car, Order My Spec. |
| 4.6.2 | Features Section (grid of 3–4 features with icons and descriptions) | ✅ | Features component with 4 features |
| 4.6.3 | Call-to-Action Section (headline; sign-up encouragement; Sign up button) | ✅ | CTASection with “Get started” / “Learn more” |

---

## 4.7 Additional Pages

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.7.1 | Static Content Pages (About, Car Value Calculator, Protection Plans, FAQ, Careers, Contact, Blog; from “More” dropdown) | ✅ | All routes exist; linked from Header “More” dropdown |

---

## 4.8 Navigation & Layout

| # | Requirement | Status | Notes |
|---|-------------|--------|------|
| 4.8.1 | Header (logo; Browse Cars; Sell Your Car; More dropdown; My Listings; Saved; Profile/Logout or Login/Sign Up; sticky; auth-based content) | ✅ | Header + UserMenu; all links present |
| 4.8.2 | Footer (For Buyers, For Sellers, Account, **Company**; copyright) | ✅ | Footer has AutoSales, For Buyers, For Sellers, Account. **No “Company” section** Footer includes Company section with About, Careers, Contact, Blog. |

---

## 5. Technical Requirements (summary)

| Area | Status | Notes |
|------|--------|-------|
| Stack (Next.js, React, TypeScript, Supabase, Tailwind, Vercel) | ✅ | Next.js 16, React 19, TS, Supabase, Tailwind 4 |
| DB schema (profiles, car_listings, car_images, favorites; RLS; triggers; indexes) | ✅ | Implemented per PRD |
| Storage (car-images, avatars; limits; policies) | ✅ | Buckets and policies in use |
| Security (auth, RLS, validation, env vars) | ✅ | Server/client validation; RLS |
| Performance (SSR, images, loading states) | ✅ | unstable_noStore where needed; skeletons |
| Accessibility & responsive | ⚠️ | Semantic HTML and responsive layout; full WCAG audit not verified |

---

## Out of Scope (MVP) – PRD §9

These are explicitly **not** required for MVP; status is for reference only.

| Feature | In App? | Note |
|---------|--------|------|
| In-app messaging | ❌ | Not implemented |
| Admin dashboard | ✅ | Implemented beyond MVP (/admin/users, /admin/spec-requests) |
| Payment processing | ❌ | Not in scope |
| Full-text search / map search | ❌ | Not in scope |

---

## Post-MVP / Extra Features Implemented

| Feature | Notes |
|---------|--------|
| Order My Spec | Full flow: /order-spec form, spec_requests table, admin spec-requests page. Linked from Hero. |
| hCaptcha on login | CAPTCHA verification for sign-in when enabled in Supabase. |
| Admin: users + spec-requests | AdminLink, RBAC-style checks; spec request management and export. |

---

## Outstanding (To Complete per PRD)

1. **Sort option (4.3.3)**  
   - Add “Mileage: High to Low” to SortControls (e.g. `mileage_desc`).

2. **Footer “Company” section (4.8.2)**  
   - Add a fourth link group (e.g. “Company”) with links to About, Careers, Contact (and optionally Blog) if you want strict PRD alignment.

---

## Summary

| Category | Done | Partial | Not done |
|----------|------|---------|----------|
| Auth & user management | 4 | 0 | 0 |
| Vehicle listings | 5 | 0 | 0 |
| Search & discovery | 3 | 1 | 0 |
| Favorites | 2 | 0 | 0 |
| Dashboard | 1 | 0 | 0 |
| Landing page | 3 | 0 | 0 |
| Additional pages | 1 | 0 | 0 |
| Navigation & layout | 2 | 0 | 0 |

**Overall:** Most PRD MVP requirements are implemented. Outstanding items: **one sort option** (“Mileage: High to Low”) and optionally **Footer Company section**. Hero search form (4.6.1) is implemented.
