# Auto Sales Platform - File Structure

This document outlines the complete file structure for the auto sales platform built with Next.js 15, TypeScript, App Router, and Tailwind CSS.

## Project Structure

```
auto-dealership-app/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout with Header/Footer
│   │   ├── page.tsx                  # Landing page (home)
│   │   ├── globals.css               # Global styles
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Login page
│   │   │   └── register/
│   │   │       └── page.tsx          # Registration page
│   │   ├── cars/                     # Car listings routes
│   │   │   ├── page.tsx              # Browse/list all cars
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create new listing
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Car detail page
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile page
│   │   └── dashboard/
│   │       └── my-listings/
│   │           └── page.tsx          # User's car listings
│   │
│   ├── components/                   # React components
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx            # Site header/navigation
│   │   │   └── Footer.tsx            # Site footer
│   │   │
│   │   ├── landing/                  # Landing page components
│   │   │   ├── Hero.tsx              # Hero section
│   │   │   ├── Features.tsx          # Features section
│   │   │   ├── FeaturedListings.tsx  # Featured cars section
│   │   │   └── CTASection.tsx        # Call-to-action section
│   │   │
│   │   ├── cars/                     # Car-related components
│   │   │   ├── CarCard.tsx           # Car listing card
│   │   │   ├── CarFilters.tsx        # Filter component
│   │   │   └── CarGallery.tsx        # Image gallery for car details
│   │   │
│   │   ├── forms/                    # Form components
│   │   │   ├── Button.tsx            # Reusable button component
│   │   │   ├── Input.tsx             # Text input component
│   │   │   ├── Textarea.tsx          # Textarea component
│   │   │   └── Select.tsx            # Select dropdown component
│   │   │
│   │   └── auth/                     # Authentication components
│   │       ├── LoginForm.tsx         # Login form
│   │       └── RegisterForm.tsx      # Registration form
│   │
│   └── lib/                          # Utilities and helpers
│       ├── utils.ts                  # Utility functions (cn helper)
│       ├── supabase/                 # Supabase client setup
│       │   ├── client.ts             # Browser client
│       │   └── server.ts             # Server client
│       └── validators/               # Zod validation schemas
│           ├── car.ts                # Car listing validation
│           └── auth.ts               # Auth validation
│
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
└── tailwind.config.ts                # Tailwind CSS config (if needed)
```

## Component Breakdown

### Layout Components

- **Header.tsx**: Main navigation header with logo, links, and auth buttons
- **Footer.tsx**: Site footer with links and copyright

### Landing Page Components

- **Hero.tsx**: Main hero section with headline and CTA buttons
- **Features.tsx**: Feature grid showcasing platform benefits
- **FeaturedListings.tsx**: Grid of featured car listings
- **CTASection.tsx**: Final call-to-action section

### Car Components

- **CarCard.tsx**: Reusable card component for displaying car listings in grids
- **CarFilters.tsx**: Filter component for searching/filtering cars (client component)
- **CarGallery.tsx**: Image gallery with thumbnail navigation for car detail pages

### Form Components

- **Button.tsx**: Reusable button with variants (primary, secondary, outline, ghost)
- **Input.tsx**: Text input with label and error handling
- **Textarea.tsx**: Textarea input with label and error handling
- **Select.tsx**: Select dropdown with label and error handling

### Auth Components

- **LoginForm.tsx**: Login form with email/password
- **RegisterForm.tsx**: Registration form with validation

## Route Structure

- `/` - Landing page (home)
- `/login` - User login
- `/register` - User registration
- `/cars` - Browse all car listings (with filters)
- `/cars/new` - Create a new car listing (requires auth)
- `/cars/[id]` - View car details
- `/profile` - User profile page (requires auth)
- `/dashboard/my-listings` - User's car listings dashboard (requires auth)

## Next Steps

1. **Install Dependencies**: 
   ```bash
   npm install clsx tailwind-merge zod @supabase/ssr
   ```

2. **Set up Supabase**:
   - Create a Supabase project
   - Set up environment variables (`.env.local`):
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Database Setup**:
   - Create tables: `profiles`, `car_listings`, `car_images`
   - Set up Row Level Security (RLS) policies
   - Create Supabase Storage bucket for car images

4. **Implement Server Actions**:
   - Create server actions for CRUD operations
   - Implement authentication logic
   - Add image upload functionality

5. **Complete Pages**:
   - Implement data fetching in `/cars` page
   - Complete car listing form in `/cars/new`
   - Add car detail page data fetching
   - Implement profile and dashboard pages

## Component Usage Examples

### Using CarCard
```tsx
import { CarCard } from "@/components/cars/CarCard";

<CarCard
  id="1"
  title="2019 Honda Civic"
  price={22000}
  location="Toronto, ON"
  year={2019}
  mileage={45000}
  make="Honda"
  model="Civic"
  imageUrl="/car-image.jpg"
/>
```

### Using Form Components
```tsx
import { Input, Button } from "@/components/forms";

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  error={errors.email}
/>

<Button variant="primary" size="lg">
  Submit
</Button>
```

## Styling

The project uses Tailwind CSS with:
- Dark mode support
- Responsive design (mobile-first)
- Consistent color scheme using zinc palette
- Utility-first approach

## Type Safety

- TypeScript for all components and utilities
- Zod schemas for runtime validation
- Type-safe Supabase client with generated types (when Supabase types are added)
