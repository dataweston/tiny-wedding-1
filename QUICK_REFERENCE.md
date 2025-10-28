# Quick Reference - Context Recovery

**Purpose:** If context is lost during development, read this file first to quickly recover project understanding.

## Project: Tiny Weddings
**What:** Wedding package sales + client onboarding platform  
**When:** Started October 28, 2025  
**Goal:** Complete MVP in single development session

## Architecture Decision
**CHOSEN:** TypeScript End-to-End (Next.js 14 + Supabase + Vercel)

**Why:**
- Vercel-native deployment (zero config)
- Built-in real-time with Supabase
- Fast development in single session
- End-to-end type safety
- Serverless auto-scaling

**Rejected:**
- ❌ Rails + Hotwire (Vercel deployment complex)
- ❌ Phoenix + LiveView (Not supported on Vercel)
- ❌ Laravel + Livewire (PHP hosting challenging)

## Core Features

### 1. Landing Page
Single-page site with "Get Started" CTA

### 2. Two Package Options

**Both Options Start With:**
- Real-time availability calendar
- $1,000 deposit to hold date (via Square)
- Date instantly marked as booked

**A. Fast Package ($5,000)**
- Pre-configured bundle (coordination, venue, catering, florals, photography, officiant, bar)
- Quick deposit checkout
- $1,000 deposit + $4,000 balance
- Square payment integration

**B. Build Your Own**
- Pay $1,000 deposit to hold date first
- Then complete questionnaire
- Custom dashboard
- Real-time pricing
- Vendor selection

### 3. Client Dashboard
- Select/deselect services
- Real-time cost calculator
- Autosave (500ms debounce)
- Vendor messaging
- Shared with admin (real-time sync)

### 4. Admin Panel
- View all client dashboards
- Vendor management
- Easy vendor onboarding
- Message oversight

### 5. Real-time Features
- Dashboard updates sync to admin immediately
- Messages delivered instantly
- Cost recalculates live

## Tech Stack Summary

```
Frontend: Next.js 14 + TypeScript + Tailwind + shadcn/ui
Backend:  Next.js Server Actions + Prisma ORM
Database: PostgreSQL (Supabase)
Realtime: Supabase Realtime (WebSocket)
Auth:     Supabase Auth
Payment:  Square
Deploy:   Vercel + GitHub
```

## Database Tables (Core)

1. **users** - clients, vendors, admins
2. **vendors** - vendor profiles + services
3. **packages** - pre-configured packages
4. **bookings** - date reservations, payments ($1k deposits), real-time availability
5. **client_dashboards** - client package builders (linked to bookings)
6. **dashboard_services** - selected services
7. **messages** - client-vendor chat

## File Structure

```
tiny-wedding/
├── Documentation (✅ COMPLETE)
│   ├── README.md
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── DEVELOPMENT_GUIDELINES.md
│   ├── FEATURES_CHECKLIST.md
│   ├── FAST_PACKAGE_DETAILS.md
│   └── QUICK_REFERENCE.md (this file)
│
├── Application (TO BUILD)
│   ├── src/app/           # Next.js pages
│   ├── src/components/    # React components
│   ├── src/lib/          # Utils, Supabase, Prisma
│   ├── prisma/           # Database schema
│   └── public/           # Static assets
│
└── Config
    ├── .env.example
    ├── .gitignore
    ├── next.config.js (to create)
    ├── tailwind.config.ts (to create)
    └── tsconfig.json (to create)
```

## Implementation Order

1. ✅ **Documentation** - Done
2. → **Foundation** - Next.js setup, Supabase, Prisma
3. → **Landing** - Single page with CTA
4. → **Package Selection** - Modal/page with 2 options
5. → **Fast Package** - Checkout flow
6. → **Questionnaire** - Multi-step form
7. → **Client Dashboard** - Interactive builder
8. → **Real-time** - Supabase subscriptions
9. → **Messaging** - Client-vendor chat
10. → **Admin Panel** - All dashboards view
11. → **Polish** - Autosave, auth, mobile, deploy

## Key Patterns

### Server vs Client Components
- **Server (default):** Static content, initial data fetch
- **Client ('use client'):** Forms, real-time, interactions

### Data Mutations
```typescript
'use server'
export async function updateDashboard(data) {
  // Validate with Zod
  // Auth check
  // Prisma update
  // Return result
}
```

### Real-time
```typescript
const channel = supabase
  .channel(`dashboard:${id}`)
  .on('postgres_changes', {}, handleChange)
  .subscribe()
```

### Autosave
```typescript
const debouncedSave = useDebouncedCallback(save, 500)
onChange={(val) => {
  setLocal(val)
  debouncedSave(val)
}}
```

## Environment Variables Needed

```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SQUARE_ACCESS_TOKEN
SQUARE_LOCATION_ID
NEXT_PUBLIC_SQUARE_APPLICATION_ID
SQUARE_ENVIRONMENT
```

## Current Status

**Phase:** Documentation Complete ✅  
**Next:** Initialize Next.js project

**To-Do List:**
1. ✅ Create documentation
2. Initialize Next.js + TypeScript
3. Configure dependencies (shadcn, Supabase, Prisma)
4. Set up database schema
5. Build landing page
6. Build package selection
7. Build fast package flow
8. Build questionnaire
9. Build client dashboard
10. Implement real-time
11. Build messaging
12. Build admin panel
13. Add autosave
14. Add authentication
15. Configure deployment
16. Polish and responsive design

## Questions for Client (Still Needed)

1. **Fast Package Services** - What's included in $5k?
2. **Team Info** - Names, roles, photos for landing page
3. **Branding** - Colors, logo, voice/tone
4. **Vendor Categories** - Photography, catering, etc.?
5. **Initial Vendors** - Any to add immediately?

## Quick Commands (Once Built)

```bash
# Start dev
npm run dev

# Database
npx prisma migrate dev
npx prisma studio

# Type check
npm run type-check

# Build
npm run build

# Deploy
git push origin main  # Auto-deploys via Vercel
```

## Important Files to Reference

- **Architecture details:** ARCHITECTURE.md
- **Coding patterns:** DEVELOPMENT_GUIDELINES.md
- **Feature checklist:** FEATURES_CHECKLIST.md
- **Timeline & rationale:** IMPLEMENTATION_PLAN.md

## If You're Lost

1. Read this file (QUICK_REFERENCE.md)
2. Check PROJECT_OVERVIEW.md for features
3. Check ARCHITECTURE.md for schema
4. Check DEVELOPMENT_GUIDELINES.md for patterns
5. Check IMPLEMENTATION_PLAN.md for next steps

---

**Remember:** We're building a real-time wedding package builder with admin oversight. TypeScript + Next.js + Supabase + Vercel is the stack. Start with foundation, then build features incrementally.
