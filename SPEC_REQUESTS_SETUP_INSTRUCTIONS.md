# Car Spec Requests Feature - Setup Instructions

This document provides instructions for setting up the "Order My Spec" feature that allows customers to request cars with specific specifications.

## Overview

The "Order My Spec" feature enables customers to:
- Submit detailed car specification requests through a form
- Specify preferences for make, model, year, mileage, price, transmission, fuel type, condition, and color
- Add additional requirements in a free-text field

Admin users can:
- View all spec requests in a dedicated admin page
- Update request status (pending, in_progress, fulfilled, cancelled)
- Download all requests as a PDF report

## Setup Steps

### 1. Database Migration

Run the SQL migration to create the `car_spec_requests` table:

1. Go to your Supabase Dashboard → SQL Editor → New Query
2. Copy and paste the entire contents of `CREATE_CAR_SPEC_REQUESTS_TABLE.sql`
3. Click "Run" to execute the migration

This will create:
- `car_spec_requests` table with all necessary columns
- Indexes for performance
- Row Level Security (RLS) policies
- Trigger for updating `updated_at` timestamp

### 2. Install Dependencies

The PDF generation libraries have already been installed:
- `jspdf` - For PDF generation
- `jspdf-autotable` - For table formatting in PDFs

If you need to reinstall:
```bash
npm install jspdf jspdf-autotable
```

### 3. Verify Routes

The following routes are now available:

- **Public Route:**
  - `/order-spec` - Form for customers to submit spec requests

- **Admin Routes (require admin authentication):**
  - `/admin/spec-requests` - View and manage all spec requests

### 4. Access the Feature

#### For Customers:
1. Visit the landing page
2. Click the "Order My Spec" button (blue button next to "Browse Cars")
3. Fill out the form with your car specifications
4. Submit the request

#### For Admins:
1. Log in as an admin user
2. Click "Admin" in the header (dropdown menu)
3. Select "Spec Requests" from the dropdown
4. View all requests, update statuses, and download PDF reports

## Features

### Spec Request Form

The form includes:
- **Contact Information:** First name, last name, email, phone (optional)
- **Car Specifications:**
  - Make (with autocomplete)
  - Model (dynamic dropdown based on selected make)
  - Year range (min/max)
  - Maximum mileage
  - Price range (min/max)
  - Transmission (automatic, manual, any)
  - Fuel type (gasoline, diesel, electric, hybrid, other, any)
  - Condition (new, used, any)
  - Preferred color
- **Additional Requirements:** Free-text field for any other specifications

### Admin Dashboard

The admin page provides:
- List of all spec requests with full details
- Status badges (pending, in_progress, fulfilled, cancelled)
- Status update dropdown for each request
- "Download PDF Report" button to export all requests

### PDF Export

The PDF report includes:
- Title and generation date
- Table with all request details:
  - Name, Email, Phone
  - Make, Model, Year, Mileage
  - Price Range, Transmission, Fuel Type, Condition, Color
  - Status, Submission Date
- Additional requirements section with full text for each request

## Database Schema

The `car_spec_requests` table includes:

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to profiles, nullable for non-authenticated users)
- first_name, last_name, email, phone
- make, model, year_min, year_max, mileage_max
- price_min, price_max
- transmission, fuel_type, condition_type, color
- additional_requirements
- status (pending, in_progress, fulfilled, cancelled)
- created_at, updated_at
```

## Row Level Security (RLS)

RLS policies are configured to:
- Allow users to view/update their own requests
- Allow admins to view/update all requests
- Allow anyone (including non-authenticated users) to create requests

## Troubleshooting

### "new row violates row-level security policy" Error

**Recommended fix (bypasses RLS for spec submissions):**

Add your Supabase Service Role Key to `.env.local`:

1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (NOT the anon key - keep that secret!)
3. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
4. Restart your dev server (`npm run dev`)

The app now uses the service role for spec request inserts, which bypasses RLS and allows both logged-in and anonymous submissions.

**Alternative: Fix RLS policies**

If you prefer not to use the service role key:

1. Go to Supabase Dashboard → SQL Editor → New Query
2. Copy and paste the contents of `FIX_CAR_SPEC_REQUESTS_RLS.sql`
3. Click "Run" to execute the fix
4. Try submitting the form again

### PDF Download Not Working

If the PDF download button doesn't work:
1. Check browser console for errors
2. Ensure `jspdf` and `jspdf-autotable` are installed
3. Try refreshing the page

### Admin Page Not Accessible

If you can't access the admin page:
1. Verify your user has `admin` role in the `profiles` table
2. Check that RLS policies are correctly set up
3. Ensure you're logged in

### Form Submission Errors

If form submission fails:
1. Check browser console for validation errors
2. Verify database table exists and RLS policies are active
3. Check server logs for detailed error messages

## Next Steps

After setup, you can:
1. Test the form by submitting a spec request
2. Access the admin page to view the request
3. Test the PDF download functionality
4. Customize the form fields or PDF format as needed

## Support

If you encounter any issues:
1. Check the Supabase logs for database errors
2. Review the browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure the database migration ran successfully
