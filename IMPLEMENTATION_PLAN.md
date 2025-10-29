# Tiny Weddings - Implementation Plan

## Architecture Decision: TypeScript End-to-End (Next.js)

### ✅ Selected Stack
**Next.js 14 + TypeScript + Supabase + Vercel**

### Why This Choice?

#### 1. Vercel Deployment (Critical Requirement)
- Next.js is built by Vercel → zero-config deployment
- Automatic preview deployments for PRs
- Serverless functions out of the box
- Edge runtime support
- Perfect CDN integration

**vs. Alternatives:**
- ❌ Rails: Requires custom server, complex Vercel setup
- ❌ Phoenix: Elixir not supported on Vercel
- ❌ Laravel: PHP hosting challenging on Vercel

#### 2. Real-time Requirements
- Supabase provides PostgreSQL + Realtime subscriptions
- WebSocket connections managed automatically
- Row-level security at database level
- No need for separate WebSocket server

**vs. Alternatives:**
- Rails Action Cable: Good, but deployment complex
- Phoenix LiveView: Excellent, but platform incompatible
- Laravel Echo: Requires Redis, more complex setup

#### 3. Development Speed
- Single codebase, single language (TypeScript)
- Rich ecosystem of React components
- Can build entire MVP in single session
- Hot module reloading
- Excellent TypeScript support

#### 4. Type Safety
- End-to-end type safety
- Prisma generates types from database
- Zod validates at runtime
- Catch errors before deployment

#### 5. Scalability
- Serverless by default
- Auto-scaling
- Global CDN
- Pay per use

## Project Structure

```
tiny-wedding/
├── Documentation (Created ✅)
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT_GUIDELINES.md
│   ├── FEATURES_CHECKLIST.md
│   └── FAST_PACKAGE_DETAILS.md
│
├── Application Code (To Build)
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── (auth)/            # Auth group
│   │   │   ├── (client)/          # Client routes
│   │   │   └── (admin)/           # Admin routes
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utilities
│   │   └── types/                 # TypeScript types
│   │
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   │
│   └── Configuration
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── .env.local
```

## Implementation Phases

### Phase 1: Foundation (Tasks 2-4)
1. Initialize Next.js with TypeScript
2. Configure Tailwind CSS + shadcn/ui
3. Set up Supabase project
4. Create Prisma schema
5. Initialize database

**Deliverable:** Working development environment

### Phase 2: Landing & Selection (Tasks 5-6)
1. Build landing page
2. Create package selection UI
3. Set up routing

**Deliverable:** Public-facing entry point

### Phase 3: Availability & Booking (Task 7)
1. Real-time availability calendar
2. Date selection UI
3. Display package details
4. Deposit checkout ($1k via Square)
5. Square payment integration
6. Booking confirmation

**Deliverable:** Calendar + deposit flow for both packages

### Phase 4: Custom Package Flow (Tasks 8-9)
1. Multi-step questionnaire
2. Client dashboard
3. Service selection logic
4. Cost calculator

**Deliverable:** Build-your-own package flow

### Phase 5: Real-time & Messaging (Tasks 10-11)
1. Supabase Realtime setup
2. Dashboard sync
3. Messaging interface
4. Real-time message delivery

**Deliverable:** Live collaboration features

### Phase 6: Admin Panel (Task 12)
1. Admin dashboard
2. Vendor management
3. Vendor onboarding form
4. Client dashboard viewer

**Deliverable:** Admin control panel

### Phase 7: Polish (Tasks 13-16)
1. Autosave implementation
2. Authentication flows
3. Loading states
4. Error handling
5. Mobile responsiveness
6. Deployment configuration

**Deliverable:** Production-ready application

## Key Technical Decisions

### 1. Data Flow

**Server Components (Default):**
- Landing page
- Static content
- Initial data fetching

**Client Components:**
- Dashboard (real-time updates)
- Forms (user interaction)
- Messaging (WebSocket)

### 2. State Management

**Local State:** useState for component state
**Server State:** Supabase queries + Realtime
**Form State:** React Hook Form
**Global State:** React Context (if needed)

### 3. Database Access

**Server Actions:** Mutations (create, update, delete)
**Direct Queries:** Read operations in Server Components
**Prisma ORM:** All database access
**RLS Policies:** Security at database level

### 4. Real-time Strategy

```typescript
Client Dashboard Changes
    ↓
Server Action (Prisma)
    ↓
PostgreSQL Update
    ↓
Supabase Realtime Broadcast
    ↓
All Subscribed Clients (Admin + Client)
```

### 5. Autosave Pattern

```typescript
User Types
    ↓
Local State Update (immediate UI)
    ↓
Debounce (500ms)
    ↓
Server Action
    ↓
Database Update
    ↓
Real-time Broadcast
```

## Critical Dependencies

### Core
- next@14
- react@18
- typescript@5
- tailwindcss@3

### Database & Backend
- @prisma/client
- @supabase/supabase-js
- @supabase/ssr

### UI Components
- @radix-ui/* (via shadcn/ui)
- lucide-react (icons)
- tailwind-merge
- clsx

### Forms & Validation
- react-hook-form
- @hookform/resolvers
- zod

### Utilities
- date-fns (date handling)
- use-debounce (autosave)

### Payments
- square (Square SDK for backend)
- react-square-web-payments-sdk (Square Web Payments SDK for React)

## Environment Setup

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# Square
SQUARE_ACCESS_TOKEN="..."
SQUARE_LOCATION_ID="..."
NEXT_PUBLIC_SQUARE_APPLICATION_ID="..."
SQUARE_ENVIRONMENT="sandbox"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Database Changes**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Type Checking**
   ```bash
   npm run type-check
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment Workflow

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel Auto-Deploys**
   - Preview: Every PR
   - Production: Main branch

3. **Post-Deploy**
   - Run migrations (if needed)
   - Verify environment variables
   - Test critical paths

## Success Criteria

### MVP Must Have
✅ Landing page with package options
✅ $5k Simple Package checkout
✅ Custom package questionnaire
✅ Client dashboard with real-time pricing
✅ Admin view of all dashboards
✅ Vendor onboarding
✅ Basic messaging
✅ Autosave
✅ Mobile responsive
✅ Deployed to Vercel

### Nice to Have (Post-MVP)
- Email notifications
- Advanced analytics
- Payment plans
- Contract signing
- Calendar integration

## Risk Mitigation

### Risk: Real-time complexity
**Mitigation:** Use Supabase Realtime (managed service)

### Risk: Square integration complexity
**Mitigation:** Use Square Web Payments SDK, start with simple deposit checkout

### Risk: Time constraints
**Mitigation:** Focus on MVP, mark nice-to-haves for later

### Risk: Type safety gaps
**Mitigation:** Use Prisma + Zod for runtime validation

## Timeline Estimate

**Total:** ~8-12 hours for MVP

- Foundation: 1-2 hours
- Landing + Selection: 1 hour
- Simple Package: 1 hour
- Custom Package: 2-3 hours
- Real-time + Messaging: 2-3 hours
- Admin Panel: 1-2 hours
- Polish + Deploy: 1-2 hours

## Next Steps

1. ✅ Documentation created
2. → Initialize Next.js project
3. → Set up Supabase
4. → Build features incrementally
5. → Deploy to Vercel
6. → Iterate based on feedback

---

## Questions for Client

**IMPORTANT:** Please provide:

1. **Simple Package Services:** What exactly is included in the $5k package?
   - Current placeholder in `FAST_PACKAGE_DETAILS.md`

2. **Team Information:** Who should be featured on landing page?
   - Names, roles, photos, bios

3. **Branding:** 
   - Company colors
   - Logo (if available)
   - Brand voice/tone

4. **Vendor Categories:** What service categories exist?
   - Photography, Catering, Venue, Florals, DJ, etc.

5. **Initial Vendors:** Do you have vendors to add immediately?
   - Or should we build with dummy data first?

These details will be added as we build the application.
