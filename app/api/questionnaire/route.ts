import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { bookingId, questionnaireData } = await request.json()

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { client: true }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const dashboard = await prisma.clientDashboard.create({
      data: {
        bookingId: booking.id,
        clientId: booking.clientId,
        questionnaireData: questionnaireData,
        totalCost: 0,
        status: 'BUILDING'
      }
    })

    return NextResponse.json({ dashboardId: dashboard.id })
  } catch (error) {
    console.error('Error creating dashboard:', error)
    return NextResponse.json({ error: 'Failed to create dashboard' }, { status: 500 })
  }
}
