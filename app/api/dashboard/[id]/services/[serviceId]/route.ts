import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    // Delete the service
    await prisma.dashboardService.delete({
      where: { id: params.serviceId }
    })

    // Recalculate total cost
    const services = await prisma.dashboardService.findMany({
      where: { dashboardId: params.id }
    })

    const totalCost = services.reduce((sum, service) => sum + service.cost, 0)

    // Update dashboard total
    await prisma.clientDashboard.update({
      where: { id: params.id },
      data: { totalCost }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing service:', error)
    return NextResponse.json({ error: 'Failed to remove service' }, { status: 500 })
  }
}
