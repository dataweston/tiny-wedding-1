import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dashboardId = searchParams.get('dashboard')
    const vendorId = searchParams.get('vendor')

    if (!dashboardId || !vendorId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Get vendor's userId
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { userId: true }
    })

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const messages = await prisma.message.findMany({
      where: {
        dashboardId,
        OR: [
          { senderId: vendor.userId },
          { recipientId: vendor.userId }
        ]
      },
      include: {
        sender: {
          select: {
            fullName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { dashboardId, vendorId, content } = await request.json()

    // Get dashboard to find client
    const dashboard = await prisma.clientDashboard.findUnique({
      where: { id: dashboardId }
    })

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 })
    }

    // Get vendor's userId
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { userId: true }
    })

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        dashboardId,
        senderId: dashboard.clientId,
        recipientId: vendor.userId,
        content
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
