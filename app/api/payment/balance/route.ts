import { NextResponse } from 'next/server'
import { Client as SquareClient } from 'square'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'

const client = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? 'production'
    : 'sandbox'
})

export async function POST(request: Request) {
  try {
    const { bookingId, token } = await request.json()

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        dashboard: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Calculate balance amount
    const balanceAmount = booking.packageType === 'FAST'
      ? 4000
      : booking.dashboard?.totalCost || 0

    // Process payment with Square
    const { result } = await client.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(balanceAmount * 100),
        currency: 'USD'
      }
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'BALANCE_PAID',
        totalCost: balanceAmount
      }
    })

    // Update dashboard if exists
    if (booking.dashboard) {
      await prisma.clientDashboard.update({
        where: { id: booking.dashboard.id },
        data: {
          status: 'FINALIZED'
        }
      })
    }

    return NextResponse.json({
      success: true,
      paymentId: result.payment?.id
    })
  } catch (error: any) {
    console.error('Balance payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment failed' },
      { status: 500 }
    )
  }
}
