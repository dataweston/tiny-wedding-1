# Tiny Weddings - Project Overview

**Last Updated:** October 28, 2025

## Purpose
A wedding package sales and client onboarding platform that allows couples to either purchase a pre-set $5k package or build their own custom wedding package from available vendors and services.

## Core Features

### 1. Landing Page
- Single-page layout
- Services description
- Team introduction
- "Get Started" CTA

### 2. Package Options

**Availability Calendar** (Both Options)
- Real-time availability display
- Updates instantly when dates are booked
- $1,000 deposit required to hold date
- Square payment integration

**Option A: Fast Package ($5,000)**
- Pre-configured service bundle
- All-inclusive (coordination, venue, catering, florals, photography, officiant, bar)
- Quick checkout process
- Fixed pricing
- $1,000 deposit, $4,000 balance

**Option B: Build Your Own**
- Custom questionnaire
- Interactive dashboard
- Real-time pricing
- Vendor selection
- $1,000 deposit required

### 3. Client Dashboard
- View selected services and vendors
- Real-time cost calculator
- Add/remove services dynamically
- Autosave functionality
- Direct vendor messaging
- Shared view with admin (real-time sync)

### 4. Admin Panel
- View all client dashboards in real-time
- Vendor management
- Easy vendor onboarding
- Client communication oversight

### 5. Messaging System
- Client-to-vendor direct messaging
- Real-time message delivery
- Message history

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **State:** React Context + Hooks

### Backend
- **API:** Next.js Server Actions / API Routes
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Real-time:** Supabase Realtime
- **Auth:** Supabase Auth

### Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase
- **Version Control:** GitHub
- **Payments:** Square (to be integrated)

## Why This Stack?

1. **Vercel-Native:** Next.js is built by Vercel, zero-config deployment
2. **Real-time:** Supabase provides PostgreSQL + real-time subscriptions
3. **Type Safety:** Full TypeScript coverage, end-to-end
4. **Developer Experience:** Fast development, hot reload, great tooling
5. **Scalability:** Serverless architecture, auto-scaling
6. **Modern:** Current best practices, large community support

## Deployment Strategy

1. **GitHub Repository:** Source control and collaboration
2. **Vercel Integration:** Automatic deployments on push
3. **Environment Variables:** Managed in Vercel dashboard
4. **Preview Deployments:** Every PR gets a preview URL
5. **Production:** Main branch auto-deploys to production

## Project Goals

- ✅ Build entire MVP in single development session
- ✅ Real-time updates across client and admin views
- ✅ Seamless vendor onboarding process
- ✅ Professional, modern UI/UX
- ✅ Mobile-responsive design
- ✅ Type-safe, maintainable codebase
