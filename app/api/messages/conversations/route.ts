import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dashboardId = searchParams.get('dashboard')

    if (!dashboardId) {
      return NextResponse.json({ error: 'Missing dashboard ID' }, { status: 400 })
    }

    // Get all vendors that have been added to this dashboard
    const dashboardServices = await prisma.dashboardService.findMany({
      where: { dashboardId },
      include: {
        vendor: true
      },
      distinct: ['vendorId']
    })

    // Get last message for each vendor
    const conversations = await Promise.all(
      dashboardServices.map(async (service: any) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            dashboardId,
            OR: [
              { senderId: service.vendor.userId },
              { recipientId: service.vendor.userId }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        return {
          vendorId: service.vendorId,
          vendorName: service.vendor.businessName,
          lastMessage: lastMessage?.content
        }
      })
    )

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
