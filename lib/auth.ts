import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import type { User, UserRole } from '@prisma/client'

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser) return null

  // Get or create user in Prisma database
  let user = await prisma.user.findUnique({
    where: { email: supabaseUser.email! },
  })

  if (!user) {
    // Auto-create user if doesn't exist
    user = await prisma.user.create({
      data: {
        email: supabaseUser.email!,
        fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email!,
        role: 'CLIENT', // Default role
      },
    })
  }

  return user
}

export async function requireUser(): Promise<User> {
  const user = await getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireUser()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  return requireRole(['ADMIN'])
}

export async function requireClient(): Promise<User> {
  return requireRole(['CLIENT'])
}

export async function requireVendor(): Promise<User> {
  return requireRole(['VENDOR'])
}
