# Development Guidelines

## Code Style

### TypeScript
- Use TypeScript for all files
- Define explicit types, avoid `any`
- Use interfaces for object shapes
- Use type aliases for unions/primitives

### React Components
```typescript
// Prefer function components with TypeScript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### Naming Conventions
- **Components:** PascalCase (e.g., `ClientDashboard.tsx`)
- **Files:** kebab-case for utils (e.g., `format-currency.ts`)
- **Hooks:** camelCase with 'use' prefix (e.g., `useAutosave.ts`)
- **Server Actions:** camelCase (e.g., `updateDashboard.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)

## File Organization

### Server vs Client Components
```typescript
// Server Component (default in app router)
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client Component (when needed)
'use client'
export function InteractiveWidget() {
  const [state, setState] = useState()
  return <div onClick={() => setState()}>Click me</div>
}
```

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Local components
4. Local utilities
5. Types
6. Styles

```typescript
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

import { formatCurrency } from '@/lib/utils/format'
import type { Dashboard } from '@/types'
```

## Database Access

### Use Prisma for Type Safety
```typescript
import { prisma } from '@/lib/prisma'

// Good: Type-safe query
const dashboard = await prisma.clientDashboard.findUnique({
  where: { id: dashboardId },
  include: { services: true, client: true }
})

// Avoid: Raw SQL (unless absolutely necessary)
```

### Server Actions Pattern
```typescript
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const schema = z.object({
  dashboardId: z.string().uuid(),
  serviceId: z.string().uuid(),
  isSelected: z.boolean()
})

export async function toggleService(data: z.infer<typeof schema>) {
  // 1. Validate input
  const validated = schema.parse(data)
  
  // 2. Check authentication
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  
  // 3. Perform action
  const result = await prisma.dashboardService.update({
    where: { id: validated.serviceId },
    data: { isSelected: validated.isSelected }
  })
  
  // 4. Recalculate totals
  await recalculateDashboardTotal(validated.dashboardId)
  
  return result
}
```

## Real-time Patterns

### Supabase Realtime Hook
```typescript
// lib/hooks/useRealtimeSubscription.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useRealtimeSubscription<T>(
  table: string,
  filter: string,
  initialData: T[]
) {
  const [data, setData] = useState<T[]>(initialData)
  
  useEffect(() => {
    const channel = supabase
      .channel(`${table}:${filter}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [...prev, payload.new as T])
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as T : item
            ))
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()
    
    return () => { supabase.removeChannel(channel) }
  }, [table, filter])
  
  return data
}
```

## Form Handling

### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const questionnaireSchema = z.object({
  weddingDate: z.string().min(1),
  guestCount: z.number().min(1).max(500),
  budget: z.number().min(1000),
  venue: z.string().min(1)
})

type QuestionnaireData = z.infer<typeof questionnaireSchema>

export function QuestionnaireForm() {
  const form = useForm<QuestionnaireData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: { guestCount: 50, budget: 10000 }
  })
  
  const onSubmit = async (data: QuestionnaireData) => {
    await submitQuestionnaire(data)
  }
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

## Error Handling

### Try-Catch in Server Actions
```typescript
'use server'

export async function createVendor(data: VendorData) {
  try {
    const vendor = await prisma.vendor.create({ data })
    return { success: true, vendor }
  } catch (error) {
    console.error('Failed to create vendor:', error)
    return { success: false, error: 'Failed to create vendor' }
  }
}
```

### Client-Side Error Boundaries
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Testing Strategy

### Unit Tests (Vitest)
- Test utility functions
- Test validation schemas
- Test custom hooks

### Integration Tests (Playwright)
- Test critical user flows
- Test form submissions
- Test real-time updates

### E2E Tests
- Complete user journeys
- Payment flows
- Admin workflows

## Environment Variables

### Required Variables
```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Access Pattern
```typescript
// Server-side
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client-side (must use NEXT_PUBLIC_ prefix)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
```

## Performance Best Practices

1. **Use Server Components by default**
2. **Lazy load heavy components**
3. **Optimize images with next/image**
4. **Implement pagination for lists**
5. **Use React.memo() for expensive renders**
6. **Debounce search inputs**
7. **Cache static data**

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios
- Provide alt text for images

## Git Workflow

1. Create feature branch: `git checkout -b feature/vendor-onboarding`
2. Make commits: `git commit -m "Add vendor onboarding form"`
3. Push to GitHub: `git push origin feature/vendor-onboarding`
4. Create PR for review
5. Merge to main after approval
6. Vercel auto-deploys from main

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrations run
- [ ] Build succeeds locally
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Test critical paths
- [ ] Review preview deployment
- [ ] Merge to main
