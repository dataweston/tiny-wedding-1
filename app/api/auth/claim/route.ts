import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    console.log('[Auth Claim] Starting auth claim process')

    const supabase = await createClient()
    const { data, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('[Auth Claim] Supabase auth error:', authError)
    }

    const user = data.user

    if (!user || !user.email) {
      console.log('[Auth Claim] No authenticated user found')
      return NextResponse.json({ authenticated: false })
    }

    console.log('[Auth Claim] User authenticated:', user.email)

    // Upsert Prisma user by email so bookings held with that email map correctly
    const email = user.email
    const fullName = (user.user_metadata as any)?.full_name ?? (user.user_metadata as any)?.name ?? ''

    console.log('[Auth Claim] Upserting user in database:', email)

    const prismaUser = await prisma.user.upsert({
      where: { email },
      update: { fullName: fullName || undefined },
      create: { email, fullName: fullName || '', role: 'CLIENT' }
    })

    console.log('[Auth Claim] User upserted successfully:', prismaUser.id)
    console.log('[Auth Claim] Fetching user bookings and dashboards')

    // Return any active holds / dashboards for that user
    const bookings = await prisma.booking.findMany({
      where: { clientId: prismaUser.id }
    })

    const dashboards = await prisma.clientDashboard.findMany({
      where: { clientId: prismaUser.id }
    })

    console.log('[Auth Claim] Found:', { bookings: bookings.length, dashboards: dashboards.length })

    return NextResponse.json({ authenticated: true, user: prismaUser, bookings, dashboards })
  } catch (error: any) {
    console.error('[Auth Claim] Error:', error)
    const errorMessage = error?.message || error?.toString() || 'Claim failed'
    return NextResponse.json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
}
