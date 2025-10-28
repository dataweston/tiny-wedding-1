import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { totalCost, status } = await request.json()

    await prisma.clientDashboard.update({
      where: { id: params.id },
      data: {
        totalCost,
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error autosaving dashboard:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
