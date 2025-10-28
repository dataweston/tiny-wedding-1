import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const dashboards = await prisma.clientDashboard.findMany({
      include: {
        client: {
          select: {
            fullName: true,
            email: true
          }
        },
        booking: {
          select: {
            eventDate: true
          }
        },
        services: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const transformedDashboards = dashboards.map(dashboard => ({
      id: dashboard.id,
      client: dashboard.client,
      booking: dashboard.booking,
      totalCost: dashboard.totalCost,
      status: dashboard.status,
      servicesCount: dashboard.services.length
    }))

    return NextResponse.json(transformedDashboards)
  } catch (error) {
    console.error('Error fetching dashboards:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboards' }, { status: 500 })
  }
}
