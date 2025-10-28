import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const vendors = await prisma.vendor.findMany({
      where: category ? { category: category } : undefined,
      select: {
        id: true,
        businessName: true,
        category: true,
        basePrice: true,
        description: true
      }
    })

    // Map to expected format
    const formattedVendors = vendors.map((v: any) => ({
      id: v.id,
      companyName: v.businessName,
      serviceType: v.category,
      basePrice: Number(v.basePrice),
      description: v.description
    }))

    return NextResponse.json(formattedVendors)
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
  }
}
