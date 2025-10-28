'use server'

import { prisma } from '@/lib/prisma'
import { SquareClient, SquareEnvironment } from 'square'

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox
})

export async function processDeposit(data: {
  sourceId: string
  eventDate: string
  packageType: 'fast' | 'custom'
  clientEmail: string
  clientName: string
}) {
  try {
    // Create payment
    const payment = await client.payments.create({
      sourceId: data.sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(100000), // $1000 in cents
        currency: 'USD'
      },
      locationId: process.env.SQUARE_LOCATION_ID!
    })

    if (!payment.payment) {
      throw new Error('Payment failed')
    }

    // Create or get user
    let user = await prisma.user.findUnique({
      where: { email: data.clientEmail }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.clientEmail,
          fullName: data.clientName,
          role: 'CLIENT'
        }
      })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        clientId: user.id,
        eventDate: new Date(data.eventDate),
        isFastPackage: data.packageType === 'fast',
        totalCost: data.packageType === 'fast' ? 5000 : 0,
        depositPaid: true,
        depositAmount: 1000,
        depositPaymentId: payment.payment.id!,
        balanceAmount: data.packageType === 'fast' ? 4000 : 0,
        status: 'DEPOSIT_PAID'
      }
    })

    return {
      success: true,
      bookingId: booking.id,
      paymentId: payment.payment.id
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    }
  }
}
