# Component Overview

This document provides a quick reference for all components in the auto sales platform.

## Landing Page Components

### Hero
**File**: `src/components/landing/Hero.tsx`

Main hero section with headline, description, and call-to-action buttons.

**Usage**:
```tsx
import { Hero } from "@/components/landing/Hero";

<Hero />
```

### Features
**File**: `src/components/landing/Features.tsx`

Displays a grid of platform features with icons and descriptions.

**Usage**:
```tsx
import { Features } from "@/components/landing/Features";

<Features />
```

### FeaturedListings
**File**: `src/components/landing/FeaturedListings.tsx`

Shows a grid of featured car listings. Currently uses placeholder data - needs database integration.

**Usage**:
```tsx
import { FeaturedListings } from "@/components/landing/FeaturedListings";

<FeaturedListings />
```

### CTASection
**File**: `src/components/landing/CTASection.tsx`

Call-to-action section encouraging users to sign up.

**Usage**:
```tsx
import { CTASection } from "@/components/landing/CTASection";

<CTASection />
```

## Layout Components

### Header
**File**: `src/components/layout/Header.tsx`

Site header with logo, navigation links, and auth buttons. Sticky header with backdrop blur.

**Usage**: Already included in root layout.

### Footer
**File**: `src/components/layout/Footer.tsx`

Site footer with links organized by sections (For Buyers, For Sellers, Account).

**Usage**: Already included in root layout.

## Car Components

### CarCard
**File**: `src/components/cars/CarCard.tsx`

Reusable card component for displaying car listings in grids.

**Props**:
- `id: string` - Car listing ID
- `title: string` - Listing title
- `price: number` - Car price
- `location: string` - Location (city, province/state)
- `year?: number` - Year of manufacture
- `mileage?: number` - Mileage in kilometers
- `imageUrl?: string` - Main image URL
- `make?: string` - Car make
- `model?: string` - Car model

**Usage**:
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
  imageUrl="/car.jpg"
/>
```

### CarFilters
**File**: `src/components/cars/CarFilters.tsx`

Client component for filtering car listings. Uses URL search params for state.

**Features**:
- Make filter
- Price range (min/max)
- Year range (min/max)
- Clear filters button

**Usage**:
```tsx
"use client";
import { CarFilters } from "@/components/cars/CarFilters";

<CarFilters />
```

### CarGallery
**File**: `src/components/cars/CarGallery.tsx`

Image gallery component with thumbnail navigation for car detail pages.

**Props**:
- `images: string[]` - Array of image URLs
- `title: string` - Car title for alt text

**Usage**:
```tsx
"use client";
import { CarGallery } from "@/components/cars/CarGallery";

<CarGallery
  images={["/image1.jpg", "/image2.jpg"]}
  title="2019 Honda Civic"
/>
```

## Form Components

### Button
**File**: `src/components/forms/Button.tsx`

Reusable button component with multiple variants and sizes.

**Props**:
- `variant?: "primary" | "secondary" | "outline" | "ghost"` (default: "primary")
- `size?: "sm" | "md" | "lg"` (default: "md")
- Standard HTML button props

**Usage**:
```tsx
import { Button } from "@/components/forms/Button";

<Button variant="primary" size="lg">Click Me</Button>
<Button variant="outline">Cancel</Button>
```

### Input
**File**: `src/components/forms/Input.tsx`

Text input component with label and error handling.

**Props**:
- `label?: string` - Input label
- `error?: string` - Error message to display
- Standard HTML input props

**Usage**:
```tsx
import { Input } from "@/components/forms/Input";

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  error={errors.email}
/>
```

### Textarea
**File**: `src/components/forms/Textarea.tsx`

Textarea component with label and error handling.

**Props**:
- `label?: string` - Textarea label
- `error?: string` - Error message to display
- Standard HTML textarea props

**Usage**:
```tsx
import { Textarea } from "@/components/forms/Textarea";

<Textarea
  label="Description"
  placeholder="Enter description..."
  error={errors.description}
/>
```

### Select
**File**: `src/components/forms/Select.tsx`

Select dropdown component with label and error handling.

**Props**:
- `label?: string` - Select label
- `error?: string` - Error message to display
- `options: { value: string; label: string }[]` - Options array
- Standard HTML select props

**Usage**:
```tsx
import { Select } from "@/components/forms/Select";

<Select
  label="Transmission"
  options={[
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" }
  ]}
  error={errors.transmission}
/>
```

## Auth Components

### LoginForm
**File**: `src/components/auth/LoginForm.tsx`

Login form component with email and password fields. Currently has placeholder authentication logic.

**Features**:
- Email/password input
- Error handling
- Loading state
- Client component (uses hooks)

**Usage**:
```tsx
"use client";
import { LoginForm } from "@/components/auth/LoginForm";

<LoginForm />
```

**TODO**: Implement actual Supabase authentication

### RegisterForm
**File**: `src/components/auth/RegisterForm.tsx`

Registration form component with email, password, and password confirmation.

**Features**:
- Email/password inputs
- Password confirmation
- Client-side validation
- Error handling
- Loading state

**Usage**:
```tsx
"use client";
import { RegisterForm } from "@/components/auth/RegisterForm";

<RegisterForm />
```

**TODO**: Implement actual Supabase authentication

## Utility Files

### lib/utils.ts
Utility function for merging Tailwind classes using `clsx` and `tailwind-merge`.

**Usage**:
```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", condition && "conditional-classes")} />
```

### lib/supabase/client.ts
Browser-side Supabase client helper. Use in client components.

**Usage**:
```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

### lib/supabase/server.ts
Server-side Supabase client helper. Use in server components and server actions.

**Usage**:
```tsx
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
```

### lib/validators/car.ts
Zod schema for car listing validation.

**Usage**:
```tsx
import { carListingSchema } from "@/lib/validators/car";

const result = carListingSchema.safeParse(data);
```

### lib/validators/auth.ts
Zod schemas for authentication validation (login and register).

**Usage**:
```tsx
import { loginSchema, registerSchema } from "@/lib/validators/auth";

const result = loginSchema.safeParse(data);
```

## Component Guidelines

1. **Server vs Client Components**: Use server components by default. Only add `"use client"` when you need:
   - React hooks (useState, useEffect, etc.)
   - Browser APIs
   - Event handlers
   - Context

2. **Styling**: All components use Tailwind CSS with:
   - Dark mode support
   - Responsive design (mobile-first)
   - Consistent spacing and colors

3. **Type Safety**: All components are fully typed with TypeScript.

4. **Accessibility**: Form components include proper labels and error messages.

5. **Reusability**: Components are designed to be reusable across the application.
