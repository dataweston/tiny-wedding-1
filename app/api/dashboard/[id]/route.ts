import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dashboard = await prisma.clientDashboard.findUnique({
      where: { id: params.id },
      include: {
        booking: true,
        services: {
          include: {
            vendor: true
          }
        }
      }
    })

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 })
    }

    // Transform services to include vendor info
    const transformedServices = dashboard.services.map((service: any) => ({
      id: service.id,
      service: service.serviceName,
      vendorName: service.vendor.businessName,
      description: service.serviceDescription || '',
      cost: service.cost
    }))

    return NextResponse.json({
      id: dashboard.id,
      booking: {
        id: dashboard.booking.id,
        eventDate: dashboard.booking.eventDate,
        isFastPackage: dashboard.booking.isFastPackage
      },
      questionnaireData: dashboard.questionnaireData,
      totalCost: dashboard.totalCost,
      services: transformedServices,
      status: dashboard.status
    })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
