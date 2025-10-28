# Tiny Weddings - Updated Specifications

**Last Updated:** October 28, 2025  
**Version:** 2.0 (Square Integration + Availability Calendar)

## Key Changes from Initial Plan

### ✅ Payment Processor: Square (Not Stripe)
- Using Square Web Payments SDK
- Deposit: $1,000 (both packages)
- Balance: $4,000 (Fast Package) or variable (Build Your Own)

### ✅ Fast Package Details Confirmed
Complete service list from Soup Sisters provided and documented.

### ✅ Availability Calendar Required
- Real-time calendar showing available/booked dates
- Prevents double-booking
- Updates instantly when bookings occur
- Required before either package flow

## Complete User Flow

### Flow for Fast Package ($5,000)

```
1. Landing Page
   ↓
2. Click "Get Started"
   ↓
3. Package Selection Screen
   - Shows both options
   - Fast Package highlights
   ↓
4. User selects "Fast Package"
   ↓
5. **Availability Calendar** (NEW)
   - Shows available dates in real-time
   - Booked dates are disabled
   - User selects available date
   ↓
6. Package Details Page
   - Shows all included services
   - Total: $5,000
   - Deposit: $1,000
   - Balance: $4,000 (due 30 days before)
   ↓
7. Deposit Payment (Square)
   - $1,000 payment via Square
   - Credit/debit card
   ↓
8. Payment Processing
   - Square processes payment
   - Booking created in database
   - Date marked as BOOKED (real-time)
   ↓
9. Confirmation Page
   - Shows booked date
   - Payment receipt
   - What's included
   - Next steps
   - Balance due info
   ↓
10. Email Confirmation
    - Receipt
    - Event details
    - Contact info
```

### Flow for Build Your Own

```
1. Landing Page
   ↓
2. Click "Get Started"
   ↓
3. Package Selection Screen
   - Shows both options
   - Build Your Own option
   ↓
4. User selects "Build Your Own"
   ↓
5. **Availability Calendar** (NEW)
   - Shows available dates in real-time
   - User selects available date
   ↓
6. Deposit Payment (Square)
   - $1,000 deposit to hold date
   - Square payment processing
   ↓
7. Date Held Confirmation
   - Date is now reserved
   - Booking created (status: deposit_paid)
   - Date marked as BOOKED (real-time)
   ↓
8. Multi-step Questionnaire
   - Step 1: Client info
   - Step 2: Wedding details (date already confirmed)
   - Step 3: Service preferences
   - Step 4: Budget
   - Step 5: Timeline
   ↓
9. Client Dashboard Created
   - Based on questionnaire answers
   - Suggested vendors
   - Initial pricing
   ↓
10. Interactive Dashboard
    - Add/remove services
    - Real-time pricing updates
    - Vendor messaging
    - Autosave
    - Visible to admin in real-time
    ↓
11. Finalize Package
    - Review final cost
    - Submit for approval
    ↓
12. Balance Payment
    - Variable amount (due 30 days before)
    - Square payment
```

## Real-time Features Specification

### 1. Availability Calendar Real-time
**What:** Calendar that shows all available and booked dates  
**When updates:** Instantly when any booking is created  
**How:** Supabase Realtime subscription on `bookings` table  
**Who sees:** Everyone viewing the calendar  

**Implementation:**
```typescript
// Subscribe to bookings table
const channel = supabase
  .channel('bookings-calendar')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookings'
  }, (payload) => {
    // Update calendar to mark date as booked/available
    updateCalendar(payload)
  })
  .subscribe()
```

**Prevents:**
- Double-booking same date
- Race conditions (two users selecting same date simultaneously)
- Stale availability data

### 2. Client Dashboard Real-time
**What:** Dashboard with services, costs, and vendor info  
**When updates:** When client adds/removes services  
**How:** Supabase Realtime on `dashboard_services` table  
**Who sees:** Client + Admin viewing that dashboard  

**Implementation:**
```typescript
const channel = supabase
  .channel(`dashboard:${dashboardId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'dashboard_services',
    filter: `dashboard_id=eq.${dashboardId}`
  }, (payload) => {
    updateDashboardServices(payload)
    recalculateTotalCost()
  })
  .subscribe()
```

### 3. Messaging Real-time
**What:** Client-vendor direct messages  
**When updates:** New message sent  
**How:** Supabase Realtime on `messages` table  
**Who sees:** Sender, recipient, admin  

## Database Schema (Complete)

### bookings (NEW - Critical Table)
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  event_date DATE NOT NULL UNIQUE, -- Only one booking per date
  package_id UUID REFERENCES packages(id),
  is_fast_package BOOLEAN DEFAULT false,
  total_cost DECIMAL(10,2) NOT NULL,
  deposit_paid BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10,2) DEFAULT 1000.00,
  deposit_payment_id VARCHAR(255), -- Square payment ID
  balance_paid BOOLEAN DEFAULT false,
  balance_amount DECIMAL(10,2),
  balance_payment_id VARCHAR(255), -- Square payment ID
  status VARCHAR(50) DEFAULT 'pending_deposit',
    -- Status: 'pending_deposit', 'deposit_paid', 'balance_paid', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast date lookups
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Prevent double-booking
CREATE UNIQUE INDEX idx_bookings_event_date_active 
  ON bookings(event_date) 
  WHERE status != 'cancelled';
```

### client_dashboards (UPDATED - Links to Booking)
```sql
CREATE TABLE client_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id), -- Link to booking
  client_id UUID NOT NULL REFERENCES users(id),
  package_id UUID REFERENCES packages(id),
  total_cost DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'building',
    -- Status: 'building', 'submitted', 'approved'
  questionnaire_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Only one dashboard per booking
CREATE UNIQUE INDEX idx_dashboard_booking ON client_dashboards(booking_id);
```

### packages (UPDATED - Includes Deposit)
```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) DEFAULT 1000.00,
  is_fast_package BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed Fast Package
INSERT INTO packages (name, description, price, deposit_amount, is_fast_package)
VALUES (
  'Fast Package',
  'All-inclusive Tiny Wedding package',
  5000.00,
  1000.00,
  true
);
```

## Square Integration Specification

### Square Web Payments SDK
**Frontend:** `react-square-web-payments-sdk`  
**Backend:** `square` (Node.js SDK)  

### Payment Flow

#### 1. Initialize Square (Frontend)
```typescript
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk'

<PaymentForm
  applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID}
  locationId={process.env.SQUARE_LOCATION_ID}
  cardTokenizeResponseReceived={async (token) => {
    // Send token to server
    await processDeposit(token.token, selectedDate)
  }}
>
  <CreditCard />
</PaymentForm>
```

#### 2. Process Payment (Backend)
```typescript
'use server'

import { Client, Environment } from 'square'

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox // or Production
})

export async function processDeposit(
  sourceId: string,
  eventDate: string,
  packageType: 'fast' | 'custom'
) {
  // 1. Create payment
  const payment = await client.paymentsApi.createPayment({
    sourceId,
    amountMoney: {
      amount: 100000, // $1000 in cents
      currency: 'USD'
    },
    locationId: process.env.SQUARE_LOCATION_ID,
    idempotencyKey: crypto.randomUUID()
  })

  // 2. Create booking
  const booking = await prisma.booking.create({
    data: {
      client_id: userId,
      event_date: eventDate,
      is_fast_package: packageType === 'fast',
      total_cost: packageType === 'fast' ? 5000 : 0,
      deposit_paid: true,
      deposit_amount: 1000,
      deposit_payment_id: payment.result.payment.id,
      balance_amount: packageType === 'fast' ? 4000 : 0,
      status: 'deposit_paid'
    }
  })

  // 3. Real-time broadcast (automatic via Supabase)
  // Calendar updates instantly for all users

  return { success: true, booking }
}
```

### Environment Variables
```bash
# Square Sandbox (Development)
SQUARE_ACCESS_TOKEN="EAAAl..." # Sandbox access token
SQUARE_LOCATION_ID="L..." # Sandbox location ID
NEXT_PUBLIC_SQUARE_APPLICATION_ID="sandbox-sq0..." # Sandbox app ID
SQUARE_ENVIRONMENT="sandbox"

# Square Production (Production)
SQUARE_ACCESS_TOKEN="EAAAl..." # Production access token
SQUARE_LOCATION_ID="L..." # Production location ID
NEXT_PUBLIC_SQUARE_APPLICATION_ID="sq0..." # Production app ID
SQUARE_ENVIRONMENT="production"
```

## Fast Package Service Details

**Confirmed Services (from Soup Sisters):**

1. **Event Coordination & Design** - Soup Sisters
2. **Exclusive Venue Use** - Tiny Diner (ceremony + cocktail hour)
3. **Furniture & Setup** - Ceremony and cocktail hour
4. **Catering** - Seasonal hors d'oeuvres by Local Effort
5. **Beverage Package** - Curated drinks + professional bar staff
6. **Floral Design** - Ceremony installation, bouquet, boutonniere
7. **Officiant Services** - Licensed officiant
8. **Photography** - Ceremony, cocktail hour, couple's portraits

**Capacity:** Up to 50 guests  
**Duration:** 3 hours  
**Total Value:** $5,000  
**Deposit:** $1,000  
**Balance:** $4,000 (due 30 days before event)

## Critical Business Rules

### 1. One Booking Per Date
- Enforced by database UNIQUE constraint on `event_date`
- Prevents double-booking
- Date becomes unavailable immediately after deposit payment

### 2. Deposit Required to Hold Date
- Both packages require $1,000 deposit
- Deposit is non-refundable
- Date is not reserved until payment clears
- Square payment must succeed before booking is created

### 3. Real-time Availability
- Calendar updates instantly when booking occurs
- All users see same availability in real-time
- Prevents race conditions with pessimistic locking

### 4. Payment Status Tracking
```typescript
enum BookingStatus {
  PENDING_DEPOSIT = 'pending_deposit',    // Initial state
  DEPOSIT_PAID = 'deposit_paid',          // After $1k payment
  BALANCE_PAID = 'balance_paid',          // After full payment
  CANCELLED = 'cancelled'                  // If cancelled
}
```

### 5. Balance Due Timeline
- Balance due: 30 days before event
- Automated reminders (future enhancement)
- Admin can view payment status in dashboard

## Admin Features

### Admin Calendar View
- See all booked dates
- Color-coded by status:
  - Green: Balance paid
  - Yellow: Deposit paid only
  - Red: Overdue
- Click date to view booking details

### Admin Booking Management
- View all bookings
- Filter by status, date range, package type
- Payment status tracking
- Client contact information
- Dashboard access for custom packages

### Payment Tracking
```
Booking Details:
- Client: Jane Doe
- Date: June 15, 2026
- Package: Fast Package ($5,000)
- Deposit: ✅ Paid ($1,000) - Oct 28, 2025
- Balance: ⏳ Due ($4,000) - May 15, 2026
```

## Technical Implementation Notes

### Preventing Double-Booking

**Database Level:**
```sql
CREATE UNIQUE INDEX idx_bookings_event_date_active 
  ON bookings(event_date) 
  WHERE status != 'cancelled';
```

**Application Level:**
```typescript
// Check availability before payment
const existingBooking = await prisma.booking.findFirst({
  where: {
    event_date: selectedDate,
    status: { not: 'cancelled' }
  }
})

if (existingBooking) {
  throw new Error('Date no longer available')
}

// Process payment and create booking in transaction
await prisma.$transaction(async (tx) => {
  // Verify availability again
  const check = await tx.booking.findFirst({
    where: { event_date: selectedDate, status: { not: 'cancelled' } }
  })
  if (check) throw new Error('Date taken')
  
  // Process Square payment
  const payment = await processSquarePayment(sourceId, 1000)
  
  // Create booking
  await tx.booking.create({
    data: { /* ... */ }
  })
})
```

### Real-time Calendar Updates

**Component Pattern:**
```typescript
'use client'

export function AvailabilityCalendar() {
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  
  useEffect(() => {
    // Initial load
    const loadBookings = async () => {
      const bookings = await getBookings()
      setBookedDates(bookings.map(b => b.event_date))
    }
    loadBookings()
    
    // Real-time subscription
    const channel = supabase
      .channel('bookings-calendar')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setBookedDates(prev => [...prev, payload.new.event_date])
        }
        // Handle UPDATE and DELETE as well
      })
      .subscribe()
    
    return () => { supabase.removeChannel(channel) }
  }, [])
  
  return (
    <Calendar
      disabledDates={bookedDates}
      onSelectDate={handleDateSelection}
    />
  )
}
```

## Updated TODO List Summary

**Added Tasks:**
- Build availability calendar (real-time)
- Implement deposit payment flow (Square)
- Implement balance payment flow (Square)
- Create bookings table and management
- Update all package flows to start with calendar

**Updated Tasks:**
- All documentation now reflects Square (not Stripe)
- Fast Package details are complete
- Database schema includes bookings table
- Real-time includes calendar updates

## Questions Resolved

✅ **Payment Processor:** Square  
✅ **Fast Package Services:** Complete list provided  
✅ **Deposit Amount:** $1,000 for both packages  
✅ **Availability System:** Real-time calendar required  
✅ **Double-Booking Prevention:** Database constraints + real-time updates  

## Questions Still Open

❓ **Team Information:** Names, photos, bios for landing page  
❓ **Branding:** Colors, logo, specific brand voice  
❓ **Vendor Categories:** Complete list needed  
❓ **Initial Vendors:** Any to seed database with?  
❓ **Email Service:** Which service for confirmations? (SendGrid, Resend, etc.)  

---

**Ready to Build!** All specifications are now complete and documented.
