import { NextResponse } from 'next/server'
import { ZodSchema } from 'zod'
import { getUser, requireUser, requireRole } from './auth'
import type { UserRole } from '@prisma/client'

/**
 * Validate request body against a Zod schema
 */
export function validateRequest<T>(schema: ZodSchema<T>, body: unknown) {
  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      valid: false as const,
      error: NextResponse.json(
        {
          error: 'Invalid input',
          details: result.error.issues,
        },
        { status: 400 }
      ),
    }
  }
  return {
    valid: true as const,
    data: result.data,
  }
}

/**
 * Wrapper for API routes that require authentication
 */
export async function withAuth<T>(
  handler: (user: Awaited<ReturnType<typeof getUser>>) => Promise<T>
) {
  try {
    const user = await requireUser()
    return await handler(user)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    throw error
  }
}

/**
 * Wrapper for API routes that require specific role
 */
export async function withRole<T>(
  allowedRoles: UserRole[],
  handler: (user: Awaited<ReturnType<typeof getUser>>) => Promise<T>
) {
  try {
    const user = await requireRole(allowedRoles)
    return await handler(user)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    throw error
  }
}

/**
 * Generic error handler
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
