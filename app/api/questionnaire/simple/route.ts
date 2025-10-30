import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: Request) {
  try {
    // Get authenticated user
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

    const { bookingId, questionnaireData } = await request.json()

    // Verify the booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { client: true }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.client.email !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if dashboard already exists
    let dashboard = await prisma.clientDashboard.findUnique({
      where: { bookingId }
    })

    if (dashboard) {
      // Update existing dashboard
      dashboard = await prisma.clientDashboard.update({
        where: { id: dashboard.id },
        data: {
          questionnaireData
        }
      })
    } else {
      // Create new dashboard
      dashboard = await prisma.clientDashboard.create({
        data: {
          bookingId,
          clientId: booking.clientId,
          packageId: booking.packageId,
          questionnaireData,
          totalCost: 0,
          status: 'BUILDING'
        }
      })
    }

    return NextResponse.json({ dashboardId: dashboard.id })
  } catch (error) {
    console.error('Error saving simple questionnaire:', error)
    return NextResponse.json(
      { error: 'Failed to save questionnaire' },
      { status: 500 }
    )
  }
}
