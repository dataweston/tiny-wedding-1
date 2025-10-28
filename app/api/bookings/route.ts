import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventDate, packageType, clientEmail, clientName } = body

    if (!eventDate) {
      return NextResponse.json({ error: 'Missing eventDate' }, { status: 400 })
    }

    // Try to get authenticated user from Supabase (if signed in)
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const supabaseUser = authData.user ?? null

    let userEmail = clientEmail
    let userName = clientName

    if (supabaseUser?.email) {
      userEmail = supabaseUser.email
      userName = userName ?? supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Client email required (sign in or provide email)' }, { status: 400 })
    }

    // Find or create Prisma user
    let user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          fullName: userName ?? '' ,
          role: 'CLIENT'
        }
      })
    }

    // create booking hold for 12 hours
    const event = new Date(eventDate)
    const now = new Date()
    const heldUntil = new Date(now.getTime() + 12 * 60 * 60 * 1000) // 12 hours

    // Throw if there's already a booking for that date with DEPOSIT_PAID or held that hasn't expired
    const existing = await prisma.booking.findUnique({ where: { eventDate: event } })
    if (existing) {
      // if existing heldUntil expired, allow; otherwise conflict
      const existingHeld = (existing as any).heldUntil as Date | undefined
      if (existingHeld && existingHeld.getTime() < now.getTime()) {
        // expired - allow overwrite by creating new booking
      } else {
        return NextResponse.json({ error: 'Date already booked or held' }, { status: 409 })
      }
    }

    // Use any cast because Prisma client types may not be regenerated yet for heldUntil
    const booking = await (prisma as any).booking.create({
      data: {
        clientId: user.id,
        eventDate: event,
        isFastPackage: packageType === 'fast',
        totalCost: packageType === 'fast' ? 5000 : 0,
        depositPaid: false,
        depositAmount: 1000,
        balanceAmount: packageType === 'fast' ? 4000 : 0,
        status: 'PENDING_DEPOSIT',
        heldUntil
      }
    })

    // create client dashboard for the booking
    const dashboard = await prisma.clientDashboard.create({
      data: {
        bookingId: booking.id,
        clientId: user.id,
        packageId: null,
        totalCost: 0,
        status: 'BUILDING',
        questionnaireData: {}
      }
    })

    return NextResponse.json({ success: true, bookingId: booking.id, dashboardId: dashboard.id })
  } catch (error) {
    console.error('Error creating hold booking:', error)
    return NextResponse.json({ error: 'Failed to create hold' }, { status: 500 })
  }
}
