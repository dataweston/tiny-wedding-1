import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { bookingId, questionnaireData } = await request.json()

    if (typeof bookingId !== 'string' || !bookingId.trim()) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    if (typeof questionnaireData !== 'object' || questionnaireData === null) {
      return NextResponse.json({ error: 'Invalid questionnaire data' }, { status: 400 })
    }

    const normalizedBookingId = bookingId.trim()

    const booking = await prisma.booking.findUnique({
      where: { id: normalizedBookingId },
      include: { client: true }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if dashboard already exists
    let dashboard = await prisma.clientDashboard.findUnique({
      where: { bookingId: normalizedBookingId }
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
          bookingId: booking.id,
          clientId: booking.clientId,
          packageId: booking.packageId,
          questionnaireData: questionnaireData,
          totalCost: 0,
          status: 'BUILDING'
        }
      })
    }

    return NextResponse.json({ dashboardId: dashboard.id })
  } catch (error) {
    console.error('Error creating dashboard:', error)
    return NextResponse.json({ error: 'Failed to create dashboard' }, { status: 500 })
  }
}
