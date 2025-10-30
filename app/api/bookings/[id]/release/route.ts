import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization - user must own this booking
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the booking and verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { client: true }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.client.email !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Only allow release if deposit hasn't been paid
    if (booking.depositPaid) {
      return NextResponse.json(
        { error: 'Cannot release date after deposit has been paid' },
        { status: 400 }
      )
    }

    // Delete the booking and associated dashboard
    // This will cascade delete dashboard_services and messages
    await prisma.booking.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: 'Date released successfully' })
  } catch (error) {
    console.error('Error releasing date:', error)
    return NextResponse.json({ error: 'Failed to release date' }, { status: 500 })
  }
}
