import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const vendors = await prisma.vendor.findMany({
      where: category ? { serviceType: category } : undefined,
      select: {
        id: true,
        companyName: true,
        serviceType: true,
        basePrice: true,
        description: true
      }
    })

    return NextResponse.json(vendors)
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
  }
}
