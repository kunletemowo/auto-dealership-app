# Product Requirements Document (PRD)
## Auto Dealership Marketplace Platform - MVP

**Version:** 1.0  
**Date:** January 17, 2026  
**Status:** MVP Completed  
**Product Type:** Web Application (B2C Marketplace)

---

## 1. Executive Summary

This PRD documents the MVP features of an auto dealership marketplace platform that enables individuals and businesses to list, browse, search, and manage vehicle listings. The platform provides a complete solution for connecting car sellers with potential buyers through an intuitive web interface with authentication, search functionality, and listing management capabilities.

### Product Vision
To create a user-friendly, Canadian-focused online marketplace where car sellers can easily list their vehicles and buyers can efficiently search and discover vehicles that meet their needs.

### Key Highlights
- **Platform Type:** Online vehicle marketplace
- **Target Market:** Canadian automotive market (individuals and businesses)
- **Core Value Proposition:** Simplify the process of buying and selling vehicles online
- **Technology Stack:** Next.js 14, React, TypeScript, Supabase, Tailwind CSS, Vercel

---

## 2. Product Overview

### 2.1 Product Description
The auto dealership marketplace is a web-based platform that facilitates the listing, discovery, and management of vehicle listings. Users can create accounts, list their vehicles with detailed information and images, search for vehicles using advanced filters, save favorites, and manage their listings through a dashboard.

### 2.2 Target Users

#### Primary Personas

**1. Individual Sellers**
- **Demographics:** Car owners looking to sell their personal vehicles
- **Goals:** Easily list their car with photos and details, manage inquiries, and sell quickly
- **Pain Points:** Complex listing processes, lack of visibility, managing inquiries
- **Needs:** Simple listing form, image uploads, dashboard to manage listings

**2. Business Sellers (Dealerships)**
- **Demographics:** Auto dealerships and businesses selling multiple vehicles
- **Goals:** Showcase inventory, manage multiple listings efficiently, establish business presence
- **Pain Points:** Inventory management, listing efficiency, brand visibility
- **Needs:** Bulk listing capabilities, business profile, listing status management

**3. Car Buyers**
- **Demographics:** Individuals searching for vehicles to purchase
- **Goals:** Find vehicles matching their criteria, compare options, contact sellers easily
- **Pain Points:** Overwhelming search results, lack of filtering options, difficulty finding relevant listings
- **Needs:** Advanced search, location-based filtering, saved favorites, detailed vehicle information

---

## 3. Product Objectives

### 3.1 Business Objectives
1. **Create a functional marketplace** where users can list and browse vehicle listings
2. **Establish user authentication** to enable personalized experiences and listing management
3. **Enable location-based discovery** with Canadian province and city filtering
4. **Facilitate seller-buyer connections** through contact information and inquiry features
5. **Build a scalable foundation** for future feature enhancements

### 3.2 User Objectives
1. **For Sellers:**
   - List vehicles quickly and easily with detailed information and multiple images
   - Manage listings (create, edit, delete, activate/deactivate)
   - Track listing views and engagement
   - Maintain professional profiles

2. **For Buyers:**
   - Search and filter vehicles by multiple criteria (make, model, location, price, etc.)
   - View detailed vehicle information and images
   - Save favorite listings for later review
   - Contact sellers through displayed information

---

## 4. Features & Functional Requirements

### 4.1 Authentication & User Management

#### 4.1.1 User Registration
- **Requirement:** Users must be able to create accounts
- **Fields:**
  - First Name (required)
  - Last Name (required)
  - Email Address (required, validated)
  - Password (required, minimum 6 characters)
  - Password Confirmation (required, must match password)
- **Behavior:**
  - Email validation on client and server
  - Password strength validation
  - Success message on registration
  - Automatic profile creation upon registration
- **Success Criteria:** User can register and is automatically logged in or receives verification email

#### 4.1.2 User Login
- **Requirement:** Registered users must be able to log in
- **Fields:**
  - Email Address
  - Password
- **Behavior:**
  - Session management
  - Remember login state across page refreshes
  - Redirect to intended page after login (redirect parameter support)
  - Error handling for invalid credentials
- **Success Criteria:** Users can log in and access authenticated features

#### 4.1.3 User Logout
- **Requirement:** Authenticated users must be able to log out
- **Behavior:**
  - Clear session
  - Redirect to home page
  - Show logged-out state in navigation
- **Success Criteria:** User session is cleared and they are redirected

#### 4.1.4 User Profile Management
- **Requirement:** Users can view and edit their profile information
- **Profile Fields:**
  - Display Name (editable)
  - Email (read-only, from authentication)
  - Phone Number (editable, optional)
  - Address (editable, optional, with autocomplete)
  - City (required, with autocomplete restricted to Canada)
  - Province (optional, dropdown of Canadian provinces)
  - Postal Code (editable, optional, with autocomplete)
  - Account Type (Individual or Business, editable)
  - Profile Avatar/Photo (uploadable, max 3MB, client-side upload)
- **Behavior:**
  - Profile auto-created on registration with default values
  - Address autocomplete using OpenStreetMap Nominatim API (Canada only)
  - City and province autocomplete with suggestions
  - Profile picture upload directly to Supabase Storage
  - Form validation using Zod schemas
  - Success and error feedback
- **Success Criteria:** Users can update all profile information and see changes reflected immediately

---

### 4.2 Vehicle Listings

#### 4.2.1 Create Listing
- **Requirement:** Authenticated users can create vehicle listings
- **Required Fields:**
  - Title (text, required)
  - Description (textarea, required)
  - Make (text, required, with autocomplete from predefined list)
  - Model (dropdown, required, populated based on selected make)
  - Year (dropdown, required, range: current year to 30 years ago)
  - Mileage (number, required, in kilometers)
  - Price (number, required)
  - Currency (dropdown: CAD, USD, EUR)
  - Transmission (dropdown: Automatic, Manual)
  - Fuel Type (dropdown: Gasoline, Diesel, Electric, Hybrid, Other)
  - Condition (dropdown: New, Used)
  - Location City (required)
  - Location Region/Province (required)
  - Contact Phone (optional)
  - Contact Email (optional)
- **Images:**
  - Multiple images per listing (up to 10)
  - Supported formats: JPEG, PNG, WebP
  - Maximum file size: 5MB per image
  - Client-side image preview before upload
  - Image position ordering
- **Behavior:**
  - Form validation on client and server
  - Make autocomplete with suggestions
  - Model dropdown filtered by selected make
  - Multiple image upload with preview
  - Success message and redirect to listing detail page
  - Error handling and user feedback
- **Success Criteria:** Users can create listings with all required information and images

#### 4.2.2 Edit Listing
- **Requirement:** Listing owners can edit their listings
- **Fields:** Same as create listing (all editable)
- **Behavior:**
  - Pre-populate form with existing listing data
  - Allow updating of all fields including images
  - Preserve existing images while allowing new uploads
  - Make and model autocomplete/selection work with existing values
  - Ownership verification (only owner can edit)
- **Success Criteria:** Users can update listing information and see changes reflected

#### 4.2.3 Delete Listing
- **Requirement:** Listing owners can delete their listings
- **Behavior:**
  - Confirmation before deletion (via form submission)
  - Ownership verification
  - Cascade delete of associated images
  - Redirect to dashboard after deletion
  - Success feedback
- **Success Criteria:** Listings can be deleted and removed from the platform

#### 4.2.4 View Listing Details
- **Requirement:** All users (authenticated and unauthenticated) can view listing details
- **Displayed Information:**
  - Title, price, currency
  - All vehicle details (make, model, year, mileage, transmission, fuel type, condition)
  - Description
  - Image gallery (main image + thumbnails)
  - Location (city, province)
  - Seller information (name, account type, avatar, contact info)
  - View count (incremented on each view)
  - Save/Favorite button (authenticated users only)
  - Contact seller section
- **Behavior:**
  - View count increments atomically on each page load
  - Image gallery with thumbnail navigation
  - Responsive image display
  - Seller profile link/display
  - 404 page for non-existent listings
- **Success Criteria:** Users can view complete listing information with images and seller details

#### 4.2.5 Listing Status Management
- **Requirement:** Sellers can update listing status
- **Status Options:**
  - Active (default, listing visible in search)
  - Inactive (listing hidden from search but not deleted)
  - Sold (listing marked as sold, visible but marked)
  - Unavailable (listing temporarily unavailable)
- **Behavior:**
  - Status toggle/selector on listing card in dashboard
  - Visual indicator on listing cards
  - Active listings appear in browse/search
  - Inactive/sold/unavailable listings only visible to owner
- **Success Criteria:** Sellers can control listing visibility and status

---

### 4.3 Search & Discovery

#### 4.3.1 Browse All Listings
- **Requirement:** Users can browse all active vehicle listings
- **Display:**
  - Grid layout of listing cards
  - Each card shows: image, title, price, location, key details (year, mileage), view count
  - Responsive grid (1 column mobile, 2 tablet, 3-4 desktop)
  - Loading states with skeleton components
- **Behavior:**
  - Only active listings displayed
  - Pagination or infinite scroll (if implemented)
  - Sort controls
  - Filter controls visible
- **Success Criteria:** Users can view all listings in an organized, navigable grid

#### 4.3.2 Advanced Search & Filters
- **Requirement:** Users can search and filter listings by multiple criteria
- **Search Options:**
  - "Search by" dropdown: All, Make, Model, Title, Description, Location
  - Main search input with category-specific autocomplete
  - Make dropdown (all makes available)
  - Model dropdown (filtered by selected make)
  - Province dropdown (all Canadian provinces)
  - City/Postal Code autocomplete (restricted to Canada, filtered by province)
  - Distance filter (10km, 25km, 50km, 100km, 200km, 500km)
- **Autocomplete Features:**
  - Make autocomplete shows suggestions as user types
  - Model autocomplete filtered by selected make
  - Location autocomplete using Nominatim API (Canada only)
  - Debounced API calls (300ms delay)
  - Abort previous requests when new input
- **Behavior:**
  - URL parameters reflect current filters (shareable search URLs)
  - Filters persist on page navigation
  - Clear filters option
  - Search results update dynamically
  - Empty state message when no results
- **Success Criteria:** Users can find vehicles matching specific criteria efficiently

#### 4.3.3 Sorting
- **Requirement:** Users can sort listings by different criteria
- **Sort Options:**
  - Newest First (default)
  - Oldest First
  - Price: Low to High
  - Price: High to Low
  - Year: Newest First
  - Year: Oldest First
  - Mileage: Low to High
  - Mileage: High to Low
- **Behavior:**
  - Sort controls visible on browse page
  - Sort order reflected in URL parameters
  - Sort persists with filters
- **Success Criteria:** Users can organize listings by their preferred criteria

#### 4.3.4 Featured Listings (Homepage)
- **Requirement:** Homepage displays featured vehicle listings
- **Display:**
  - Grid of 6 latest active listings
  - Car cards with images and key information
  - "View All Listings" call-to-action button
- **Behavior:**
  - Fetches 6 most recent active listings
  - Fallback to empty state if no listings
  - Loading state with skeleton components
- **Success Criteria:** Homepage showcases recent listings to encourage browsing

---

### 4.4 Favorites/Saved Listings

#### 4.4.1 Save Listing to Favorites
- **Requirement:** Authenticated users can save listings to favorites
- **Behavior:**
  - Save button on listing detail page
  - Toggle functionality (save/unsave)
  - Visual feedback (icon change, toast notification)
  - Prevents duplicate saves
  - Database stores user-listing relationship
- **Success Criteria:** Users can save listings and see them in their favorites

#### 4.4.2 View Saved Listings
- **Requirement:** Users can view all their saved listings
- **Display:**
  - Grid layout similar to browse page
  - All saved listings with full details
  - Empty state if no saved listings
- **Behavior:**
  - Only shows active listings (removes deleted/sold listings)
  - Sortable and filterable
  - Remove from favorites action available
- **Success Criteria:** Users can access all their saved listings in one place

---

### 4.5 User Dashboard

#### 4.5.1 My Listings Dashboard
- **Requirement:** Sellers can view and manage all their listings
- **Display:**
  - Grid of all user's listings (active and inactive)
  - Status indicators (Active, Inactive, Sold, Unavailable)
  - Listing cards with edit and delete actions
  - Listing status toggle per listing
  - "Create New Listing" button
- **Features:**
  - Sort by status (active first) and date (newest first)
  - Visual distinction for inactive/sold listings (opacity)
  - Quick status update without navigation
  - Direct edit and delete actions
- **Behavior:**
  - Only shows listings owned by current user
  - Real-time status updates
  - Loading states
- **Success Criteria:** Sellers can efficiently manage all their listings from one dashboard

---

### 4.6 Landing Page

#### 4.6.1 Hero Section
- **Requirement:** Compelling hero section with primary call-to-action
- **Elements:**
  - Headline and description
  - Search form with:
    - Province dropdown (Canadian provinces)
    - City/Postal Code autocomplete (Canada only, filtered by province)
    - "Search Cars" button
  - Call-to-action buttons (Browse Cars, Sell Your Car)
- **Behavior:**
  - Search form redirects to browse page with location filters
  - Responsive design (mobile-first)
- **Success Criteria:** Visitors are engaged and can immediately start searching

#### 4.6.2 Features Section
- **Requirement:** Showcase platform benefits
- **Elements:**
  - Grid of 3-4 key features with icons
  - Feature descriptions
  - Benefits for buyers and sellers
- **Success Criteria:** Users understand platform value proposition

#### 4.6.3 Call-to-Action Section
- **Requirement:** Encourage user registration
- **Elements:**
  - Compelling headline
  - Registration encouragement text
  - Sign up button
- **Success Criteria:** Encourages new user sign-ups

---

### 4.7 Additional Pages

#### 4.7.1 Static Content Pages
- **Pages:**
  - About Us
  - Car Value Calculator
  - Protection Plans
  - FAQ
  - Careers
  - Contact Us
  - Blog
- **Requirement:** All pages accessible from "More" dropdown in header
- **Content:** Placeholder content with structured layout
- **Behavior:**
  - Consistent design and navigation
  - Loading states
  - Mobile-responsive
- **Success Criteria:** Users can access all informational pages

---

### 4.8 Navigation & Layout

#### 4.8.1 Header Navigation
- **Requirement:** Consistent header across all pages
- **Elements:**
  - Logo (clickable, links to homepage)
  - Navigation links:
    - Browse Cars
    - Sell Your Car (links to create listing page, requires auth)
    - More (dropdown menu with static pages)
    - My Listings (authenticated users only)
    - Saved (authenticated users only)
  - User menu (when authenticated):
    - Display name or email
    - Profile link
    - Logout button
  - Auth buttons (when not authenticated):
    - Login
    - Sign Up
- **Behavior:**
  - Sticky header with backdrop blur
  - Responsive mobile menu (if implemented)
  - Dynamic content based on authentication state
  - Smooth navigation transitions
- **Success Criteria:** Users can navigate the platform easily from any page

#### 4.8.2 Footer
- **Requirement:** Informative footer with links and information
- **Elements:**
  - Link sections:
    - For Buyers
    - For Sellers
    - Account
    - Company
  - Copyright information
- **Behavior:**
  - Consistent across all pages
  - All links functional
- **Success Criteria:** Users can access important links and information from footer

---

## 5. Technical Requirements

### 5.1 Technology Stack

#### Frontend
- **Framework:** Next.js 14 App Router
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI, Radix UI primitives
- **Form Validation:** Zod
- **State Management:** React Hooks (useState, useEffect)

#### Backend & Database
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Server Actions:** Next.js Server Actions
- **API:** RESTful via Supabase client

#### Infrastructure
- **Hosting:** Vercel
- **Domain:** Custom domain support with SSL
- **CDN:** Vercel Edge Network
- **Environment:** Environment variables for configuration

### 5.2 Database Schema

#### Tables

**1. profiles**
- Stores user profile information
- Linked to `auth.users` via UUID
- Fields: id, display_name, first_name, last_name, email (from auth), phone, address, city (required), province, postal_code, account_type, avatar_url, created_at, updated_at
- RLS enabled: users can view all profiles, update only their own

**2. car_listings**
- Stores vehicle listing information
- Linked to profiles via user_id
- Fields: id, user_id, title, description, make, model, year, mileage, price, currency, transmission, fuel_type, condition, location_city, location_region, location_coordinates, contact_phone, contact_email, status, is_active, view_count, created_at, updated_at
- RLS enabled: anyone can view active listings, users can manage their own

**3. car_images**
- Stores image URLs and metadata for listings
- Linked to car_listings via listing_id
- Fields: id, listing_id, image_url, position, created_at
- RLS enabled: anyone can view images for active listings, users can manage images for their own listings

**4. favorites**
- Stores user's saved/favorited listings
- Fields: id, user_id, listing_id, created_at
- RLS enabled: users can only view/manage their own favorites

#### Database Features
- Row Level Security (RLS) policies for data access control
- Automatic timestamp triggers (created_at, updated_at)
- Auto-profile creation trigger on user registration
- Database function for atomic view count increments
- Indexes on frequently queried fields (user_id, location, status, is_active)

### 5.3 Storage

#### Image Storage
- **Bucket:** `car-images` (public)
- **Profile Avatars:** `avatars` (authenticated users only)
- **File Limits:**
  - Listing images: 5MB per image, max 10 images per listing
  - Profile avatars: 3MB per file
- **Supported Formats:** JPEG, PNG, WebP
- **Storage Policies:** Public read for listing images, authenticated upload, owner-only delete

### 5.4 Security Requirements

#### Authentication & Authorization
- Secure password hashing (handled by Supabase Auth)
- Session management via secure cookies
- Protected routes requiring authentication
- Row Level Security (RLS) on all database tables
- Ownership verification for all CRUD operations

#### Data Validation
- Client-side validation using Zod schemas
- Server-side validation on all form submissions
- Input sanitization to prevent XSS
- File type and size validation for uploads
- SQL injection prevention (via Supabase parameterized queries)

#### Environment Security
- Environment variables for sensitive configuration
- No secrets committed to version control
- Secure API key storage
- HTTPS enforced in production

### 5.5 Performance Requirements

#### Page Load Times
- Initial page load: < 3 seconds
- Subsequent navigations: < 1 second (client-side routing)
- Image optimization: WebP format, lazy loading, responsive sizes
- Code splitting: Automatic via Next.js

#### Optimization Features
- Server-side rendering (SSR) for SEO and initial load
- Static generation where possible
- Image optimization via Next.js Image component
- Lazy loading for images and components
- Minimal JavaScript bundle size

### 5.6 Browser & Device Support

#### Desktop Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

#### Mobile Devices
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)
- Responsive design: 320px to 2560px+ width
- Touch-optimized interactions

#### Accessibility
- Keyboard navigation support
- Screen reader compatibility (ARIA labels)
- Color contrast ratios meeting WCAG AA standards
- Semantic HTML structure

---

## 6. User Experience Requirements

### 6.1 Design Principles
- **Mobile-First:** Design optimized for mobile, enhanced for desktop
- **Consistency:** Uniform design language across all pages
- **Clarity:** Clear information hierarchy and call-to-actions
- **Feedback:** Immediate feedback for user actions (loading states, error messages, success notifications)

### 6.2 Loading States
- Skeleton components for content loading
- Loading indicators for form submissions
- Progress feedback for file uploads
- Smooth transitions between states

### 6.3 Error Handling
- User-friendly error messages
- Validation errors displayed inline with forms
- 404 page for non-existent routes
- Error boundary for unexpected errors
- Graceful degradation when services unavailable

### 6.4 Responsive Design
- Breakpoints: Mobile (< 640px), Tablet (640px-1024px), Desktop (> 1024px)
- Touch-friendly buttons and inputs (min 44x44px)
- Readable font sizes across all devices
- Optimized images for different screen sizes

---

## 7. Integration Requirements

### 7.1 Third-Party Services

#### OpenStreetMap Nominatim API
- **Purpose:** Location autocomplete and geocoding
- **Usage:** Address suggestions, city/postal code autocomplete
- **Restrictions:** Filtered to Canada only
- **Rate Limiting:** Respects API rate limits with debouncing

#### Supabase Services
- **Database:** PostgreSQL database with RLS
- **Authentication:** User registration, login, session management
- **Storage:** File uploads for images and avatars
- **Real-time:** (Future enhancement, not in MVP)

---

## 8. Success Metrics

### 8.1 User Engagement Metrics
- Number of registered users
- Number of active listings
- Number of listings viewed
- Average views per listing
- Number of saved favorites

### 8.2 Functionality Metrics
- Listing creation success rate
- Search query completion rate
- Filter usage rate
- Profile completion rate
- Image upload success rate

### 8.3 Performance Metrics
- Average page load time
- Time to interactive (TTI)
- Image load performance
- Search query response time

### 8.4 User Satisfaction Metrics
- Error rate (form submissions, uploads, searches)
- User-reported bugs/issues
- Feature utilization rates

---

## 9. Out of Scope (MVP)

The following features are explicitly excluded from the MVP but may be considered for future releases:

### 9.1 Communication Features
- ❌ In-app messaging system between buyers and sellers
- ❌ Email notifications for inquiries
- ❌ Push notifications

### 9.2 Advanced Search
- ❌ Full-text search across all fields
- ❌ Search history
- ❌ Saved searches with alerts
- ❌ Map-based location search

### 9.3 Payment & Transactions
- ❌ Payment processing
- ❌ Transaction facilitation
- ❌ Escrow services
- ❌ Listing fees or commissions

### 9.4 Advanced Features
- ❌ Vehicle history reports (Carfax integration)
- ❌ Financing calculator
- ❌ Trade-in value estimation
- ❌ Vehicle inspection scheduling
- ❌ Reviews and ratings system

### 9.5 Content Management
- ❌ Admin dashboard for platform management
- ❌ Content moderation tools
- ❌ Listing approval workflow
- ❌ Bulk listing import/export

### 9.6 Marketing & Analytics
- ❌ Advanced analytics dashboard
- ❌ A/B testing framework
- ❌ Email marketing integration
- ❌ Social media integration

### 9.7 Mobile Applications
- ❌ Native iOS application
- ❌ Native Android application

---

## 10. Future Enhancements (Post-MVP)

Potential features for future releases (not committed):

### Phase 2 Considerations
- In-app messaging system
- Email notifications
- Advanced search with full-text search
- Map-based browsing
- Mobile applications (iOS/Android)
- Admin dashboard
- Review and rating system

### Phase 3 Considerations
- Payment processing integration
- Vehicle history reports
- Financing calculator
- Trade-in value tool
- Analytics and reporting dashboard

---

## 11. Glossary

| Term | Definition |
|------|------------|
| **Listing** | A vehicle advertisement created by a seller on the platform |
| **Make** | Vehicle manufacturer (e.g., Honda, Toyota, Ford) |
| **Model** | Vehicle model name (e.g., Civic, Camry, F-150) |
| **RLS** | Row Level Security - database-level access control |
| **MVP** | Minimum Viable Product - core features for initial launch |
| **SSR** | Server-Side Rendering - rendering pages on the server |
| **Favorites** | Saved listings by a user for later review |
| **Account Type** | Classification of seller (Individual or Business) |
| **Status** | Listing state (Active, Inactive, Sold, Unavailable) |
| **View Count** | Number of times a listing has been viewed |

---

## 12. Appendix

### 12.1 Assumptions
- Users have modern browsers with JavaScript enabled
- Users have stable internet connection
- Canadian market focus (provinces, postal codes, currency)
- Supabase service availability and reliability
- OpenStreetMap Nominatim API availability for geocoding

### 12.2 Dependencies
- Next.js framework and ecosystem
- Supabase services (Database, Auth, Storage)
- OpenStreetMap Nominatim API (for location services)
- Vercel hosting platform

### 12.3 Constraints
- Maximum 10 images per listing
- 5MB file size limit per listing image
- 3MB file size limit for profile avatars
- Canadian locations only for autocomplete
- English language only (MVP)

---

## Document Control

**Document Owner:** Product Team  
**Last Updated:** January 17, 2026  
**Version:** 1.0  
**Status:** MVP Completed

**Change History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 17, 2026 | Development Team | Initial PRD created based on implemented MVP features |

---

**End of Document**
