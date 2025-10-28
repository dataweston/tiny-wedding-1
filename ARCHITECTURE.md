# Tiny Weddings - Architecture Documentation

## Application Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js 14 (App Router)                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │  │
│  │  │  Landing   │  │   Client   │  │   Admin    │ │  │
│  │  │    Page    │  │ Dashboard  │  │   Panel    │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘ │  │
│  │                                                  │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │     Server Actions / API Routes           │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Prisma ORM
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase (Backend Services)                │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   Realtime   │  │     Auth     │  │
│  │   Database   │  │ Subscriptions│  │   Service    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### users
```typescript
- id: string (uuid, PK)
- email: string (unique)
- full_name: string
- role: enum ('client', 'vendor', 'admin')
- created_at: timestamp
- updated_at: timestamp
```

#### vendors
```typescript
- id: string (uuid, PK)
- user_id: string (FK -> users)
- business_name: string
- service_category: string
- description: text
- base_price: decimal
- contact_email: string
- contact_phone: string
- website: string?
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### packages
```typescript
- id: string (uuid, PK)
- name: string
- description: text
- price: decimal
- deposit_amount: decimal (default: 1000)
- is_fast_package: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### package_services
```typescript
- id: string (uuid, PK)
- package_id: string (FK -> packages)
- service_name: string
- service_description: text
- vendor_id: string? (FK -> vendors)
```

#### bookings
```typescript
- id: string (uuid, PK)
- client_id: string (FK -> users)
- event_date: date (unique - one booking per date)
- package_id: string? (FK -> packages)
- is_fast_package: boolean
- total_cost: decimal
- deposit_paid: boolean (default: false)
- deposit_amount: decimal (default: 1000)
- balance_paid: boolean (default: false)
- balance_amount: decimal
- square_payment_id: string?
- status: enum ('pending_deposit', 'deposit_paid', 'balance_paid', 'cancelled')
- created_at: timestamp
- updated_at: timestamp
```

#### client_dashboards
```typescript
- id: string (uuid, PK)
- booking_id: string (FK -> bookings)
- client_id: string (FK -> users)
- package_id: string? (FK -> packages)
- total_cost: decimal
- status: enum ('building', 'submitted', 'approved')
- questionnaire_data: jsonb
- created_at: timestamp
- updated_at: timestamp
```

#### dashboard_services
```typescript
- id: string (uuid, PK)
- dashboard_id: string (FK -> client_dashboards)
- vendor_id: string (FK -> vendors)
- service_name: string
- service_description: text
- cost: decimal
- is_selected: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### messages
```typescript
- id: string (uuid, PK)
- dashboard_id: string (FK -> client_dashboards)
- sender_id: string (FK -> users)
- recipient_id: string (FK -> users)
- content: text
- is_read: boolean
- created_at: timestamp
```

## Folder Structure

```
tiny-wedding/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (client)/
│   │   │   ├── dashboard/
│   │   │   └── questionnaire/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── vendors/
│   │   │   └── clients/
│   │   ├── api/
│   │   │   └── [...routes]/
│   │   ├── layout.tsx
│   │   └── page.tsx (landing)
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── prisma/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── validations/
│   └── types/
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Real-time Features

### Implementation Strategy

**Supabase Realtime Channels:**
1. **Dashboard Channel** - Per client dashboard
   - Broadcasts: Service additions/removals, cost updates
   - Listeners: Client view, Admin view

2. **Messaging Channel** - Per dashboard
   - Broadcasts: New messages
   - Listeners: Client, Vendor, Admin

**React Integration:**
```typescript
// Use React hooks for real-time subscriptions
useEffect(() => {
  const channel = supabase
    .channel(`dashboard:${dashboardId}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'dashboard_services' },
      (payload) => updateDashboard(payload)
    )
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}, [dashboardId])
```

## Autosave Strategy

```typescript
// Debounced autosave (500ms delay)
const debouncedSave = useDebouncedCallback(
  async (data) => {
    await updateDashboard(data)
  },
  500
)

// Trigger on every change
onChange={(value) => {
  setLocalState(value)
  debouncedSave(value)
}}
```

## Authentication & Authorization

### Roles
- **Client:** Can access their own dashboard, message vendors
- **Vendor:** Can view assigned dashboards, respond to messages
- **Admin:** Can view all dashboards, manage vendors, see all messages

### Row Level Security (RLS)
Implement Supabase RLS policies:
- Clients can only read/write their own dashboards
- Vendors can read dashboards they're assigned to
- Admins have full access
- Messages are only visible to sender, recipient, and admins

## API Design

### Server Actions (Preferred for mutations)
```typescript
// app/actions/dashboard.ts
'use server'

export async function updateDashboardService(
  dashboardId: string,
  serviceId: string,
  isSelected: boolean
) {
  // Auth check
  // Database update
  // Return result
}
```

### API Routes (For webhooks, external integrations)
```typescript
// app/api/webhooks/square/route.ts
export async function POST(request: Request) {
  // Handle Square webhook
}
```

## Performance Optimizations

1. **Server Components:** Use RSC for initial page loads
2. **Client Components:** Only for interactive elements
3. **Image Optimization:** Next.js Image component
4. **Code Splitting:** Automatic with App Router
5. **Database Indexing:** Index foreign keys, frequently queried fields
6. **Caching:** Leverage Next.js caching strategies

## Security Considerations

1. **Environment Variables:** Never commit secrets
2. **Input Validation:** Zod schemas for all inputs
3. **SQL Injection:** Prevented by Prisma ORM
4. **XSS:** React escapes by default
5. **CSRF:** Next.js handles CSRF protection
6. **Rate Limiting:** Implement on API routes
7. **RLS Policies:** Enforce at database level
