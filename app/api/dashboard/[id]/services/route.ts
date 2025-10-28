import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { vendorId, service, description, cost } = await request.json()

    // Create the service
    const dashboardService = await prisma.dashboardService.create({
      data: {
        dashboardId: params.id,
        vendorId,
        service,
        description,
        cost
      }
    })

    // Recalculate total cost
    const services = await prisma.dashboardService.findMany({
      where: { dashboardId: params.id }
    })

    const totalCost = services.reduce((sum, s) => sum + s.cost, 0)

    // Update dashboard total
    await prisma.clientDashboard.update({
      where: { id: params.id },
      data: { totalCost }
    })

    return NextResponse.json(dashboardService)
  } catch (error) {
    console.error('Error adding service:', error)
    return NextResponse.json({ error: 'Failed to add service' }, { status: 500 })
  }
}
