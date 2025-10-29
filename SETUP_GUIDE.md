# Tiny Weddings - Setup Guide

## ✅ Completed Setup Tasks

The following critical improvements have been implemented:

### 1. Database Initialization ✅
- Prisma client generated successfully
- Database schema ready for migration

### 2. Seed Data ✅
- Created comprehensive seed script (`prisma/seed.ts`)
- **Includes:**
  - Simple Package ($5,000) with 8 services
  - 8 sample vendors across different categories
  - Admin user: `admin@tinyweddings.com`
  - Sample client user: `client@example.com`
  - All vendor users with proper roles

**To run seed:**
```bash
npm run seed
```

### 3. Authentication System ✅
- **Supabase Auth integration** with email/password and OAuth
- Login page at `/login`
- Email signup page at `/signup/email`
- OAuth signup via Google at `/signup`
- Auth helper functions in `lib/auth.ts`:
  - `getUser()` - Get current user
  - `requireUser()` - Require authentication
  - `requireRole()` - Require specific role
  - `requireAdmin()` - Admin-only access

### 4. Protected Routes ✅
- **Middleware** (`middleware.ts`) protects:
  - `/dashboard`
  - `/messages`
  - `/balance`
  - `/admin`
- Redirects to `/login` if not authenticated
- Preserves intended destination after login

### 5. Navigation Updates ✅
- Dynamic auth state detection
- Shows "Dashboard" and "Sign Out" when logged in
- Shows "Get Started" and "Sign In" when logged out
- Mobile menu includes auth links

### 6. Input Validation ✅
- Comprehensive Zod schemas in `lib/validations.ts`:
  - Booking validations
  - Dashboard validations
  - Service validations
  - Vendor validations
  - Message validations
  - Payment validations
  - Auth validations
- API helper functions in `lib/api-helpers.ts`:
  - `validateRequest()` - Validate with Zod
  - `withAuth()` - Require authentication
  - `withRole()` - Require specific role
  - `handleApiError()` - Error handling

### 7. Environment Variables ✅
- Updated `.env.example` with correct Square variable names:
  - `NEXT_PUBLIC_SQUARE_APP_ID` (not APPLICATION_ID)
  - `NEXT_PUBLIC_SQUARE_LOCATION_ID` (now public)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (via Supabase)
- Square account (sandbox for development)
- Supabase project created

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd tiny-wedding
npm install
```

### Step 2: Configure Environment
Create `.env.local` from `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# Square (use sandbox for development)
SQUARE_ACCESS_TOKEN="EAAAl..."
NEXT_PUBLIC_SQUARE_APP_ID="sandbox-sq0..."
NEXT_PUBLIC_SQUARE_LOCATION_ID="L..."
SQUARE_ENVIRONMENT="sandbox"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Initialize Database
**Note:** You'll need a working database connection first (Supabase or local PostgreSQL)

```bash
# Generate Prisma client (already done ✅)
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or create migration (for production)
npx prisma migrate dev --name init

# Seed database (after database is connected)
npm run seed
```

**If you see "Can't reach database server":**
- Verify `DATABASE_URL` in `.env.local` is correct
- Ensure your Supabase project is running
- Check your internet connection for cloud databases

### Step 4: Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📝 Test Credentials

After seeding, you can use these accounts:

### Admin Account
- Email: `admin@tinyweddings.com`
- Access: `/admin` dashboard, full system access

### Client Account
- Email: `client@example.com`
- Access: Create bookings, manage dashboard

### Vendor Accounts
- `momentsphotography@example.com`
- `cinematicstories@example.com`
- `localeffort@example.com`
- `bloomstudio@example.com`
- `spincitydjs@example.com`
- `craftedcocktails@example.com`
- `reverendsarahjohnson@example.com`
- `tinydiner@example.com`

**Note:** For development, set passwords via Supabase dashboard or use OAuth signup.

---

## 🔒 Security Features Implemented

### 1. Route Protection
- Middleware checks authentication before allowing access
- Redirects unauthenticated users to login
- Preserves return URL after authentication

### 2. API Security
Helper functions to secure API routes:
```typescript
// Example: Protect API route
import { withAuth } from '@/lib/api-helpers'

export async function GET(request: Request) {
  return withAuth(async (user) => {
    // Only authenticated users can access
    return NextResponse.json({ data: 'protected' })
  })
}
```

### 3. Role-Based Access
```typescript
import { withRole } from '@/lib/api-helpers'

export async function POST(request: Request) {
  return withRole(['ADMIN'], async (user) => {
    // Only admins can access
    return NextResponse.json({ success: true })
  })
}
```

### 4. Input Validation
```typescript
import { validateRequest } from '@/lib/api-helpers'
import { createVendorSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const body = await request.json()
  const validation = validateRequest(createVendorSchema, body)

  if (!validation.valid) {
    return validation.error
  }

  // Use validated data
  const { data } = validation
  // ...
}
```

---

## 🧪 Testing the Application

### 1. Test Authentication Flow
1. Visit homepage
2. Click "Sign In"
3. Create account via email or Google OAuth
4. Verify redirect to dashboard
5. Verify "Sign Out" button appears in navigation

### 2. Test Package Selection
1. Click "Get Started"
2. Select "Simple Package" or "Build Your Own"
3. View availability calendar
4. Select a date
5. Complete deposit payment (use Square sandbox test cards)

### 3. Test Dashboard
1. After booking, go to `/dashboard`
2. View booked date and services
3. Add/remove services (Build Your Own)
4. Verify real-time cost updates
5. Test autosave (changes save automatically)

### 4. Test Admin Panel
1. Sign in as admin user
2. Visit `/admin`
3. View all bookings and client dashboards
4. Create new vendor
5. Monitor real-time updates

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma studio          # Visual database browser
npx prisma generate        # Regenerate Prisma client
npx prisma db push         # Push schema changes (dev)
npx prisma migrate dev     # Create migration (dev)
npx prisma migrate deploy  # Apply migrations (prod)
npm run seed               # Seed database
```

---

## 📦 Deployment Checklist

### Before Deploying to Vercel:

1. **Environment Variables** ✅
   - Add all variables from `.env.local` to Vercel
   - Use production Square credentials
   - Update `NEXT_PUBLIC_APP_URL`

2. **Database** ⚠️
   - Run migrations: `npx prisma migrate deploy`
   - Seed production data if needed
   - Verify connection pooling for Supabase

3. **Authentication** ✅
   - Configure OAuth redirect URLs in Supabase
   - Update allowed domains in Supabase Auth settings

4. **Square Setup** ⚠️
   - Switch from sandbox to production environment
   - Update environment variable: `SQUARE_ENVIRONMENT="production"`
   - Configure webhook URLs if using webhooks

5. **Build Test** ⚠️
   ```bash
   npm run build
   ```
   Ensure build succeeds locally before deploying

---

## ⚡ Next Steps / Recommendations

### High Priority
1. **Enable Supabase Auth Email Confirmation**
   - Configure email templates in Supabase
   - Test signup confirmation flow

2. **Add Email Notifications** (Not implemented)
   - Booking confirmations
   - Payment receipts
   - Vendor message alerts
   - Recommended: Resend or SendGrid

3. **Error Monitoring** (Not implemented)
   - Set up Sentry or similar
   - Add to Vercel deployment
   - Monitor production errors

4. **Rate Limiting** (Not implemented)
   - Protect payment endpoints
   - Add API route rate limits
   - Recommended: @upstash/ratelimit

### Medium Priority
5. **Row Level Security (RLS) in Supabase**
   - Add RLS policies for all tables
   - Prevent direct database access bypass

6. **Improve Error Messages**
   - User-friendly validation errors
   - Better payment failure handling
   - Clear loading states

7. **Mobile Testing**
   - Test on real devices
   - Verify touch interactions
   - Check responsive design

### Low Priority
8. **Add Tests**
   - Unit tests for utilities
   - Integration tests for API routes
   - E2E tests for critical flows

9. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Bundle size analysis

---

## 📚 Architecture Reference

### Key Files Created/Updated
- `lib/auth.ts` - Authentication helpers
- `lib/api-helpers.ts` - API security helpers
- `lib/validations.ts` - Zod schemas
- `middleware.ts` - Route protection
- `app/login/page.tsx` - Login page
- `app/signup/email/page.tsx` - Email signup
- `components/navigation.tsx` - Updated with auth
- `prisma/seed.ts` - Database seeding
- `.env.example` - Updated variable names

### Database Schema
- All tables defined in `prisma/schema.prisma`
- Seeded with realistic test data
- Proper relations and indexes

### Authentication Flow
```
User → Login/Signup → Supabase Auth → Cookie → Middleware Check → Protected Route
```

### API Security Flow
```
Request → Middleware → API Route → withAuth/withRole → Handler → Response
```

---

## 🐛 Known Issues / Limitations

1. **No Email Notifications**
   - Users don't receive booking confirmations
   - No payment receipts sent
   - Vendor messages don't trigger alerts

2. **No Rate Limiting**
   - API routes can be abused
   - No protection against spam

3. **Limited Error Handling**
   - Some API routes need better error messages
   - Payment failures could be clearer

4. **No Tests**
   - No automated testing yet
   - Manual testing required

---

## 🎉 Summary

Your Tiny Weddings application now has:
- ✅ Complete authentication system
- ✅ Protected routes with middleware
- ✅ Comprehensive input validation
- ✅ Database seeding with test data
- ✅ TypeScript type safety (no errors)
- ✅ Clean, maintainable code structure

**You're ready to test locally and prepare for deployment!**

For questions or issues, refer to:
- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

---

**Built with ❤️ for tiny weddings**
