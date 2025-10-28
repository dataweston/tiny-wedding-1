import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { companyName, serviceType, contactEmail, contactPhone, basePrice, description } = await request.json()

    // Create user for vendor
    const user = await prisma.user.create({
      data: {
        email: contactEmail,
        fullName: companyName,
        role: 'VENDOR'
      }
    })

    // Create vendor
    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName: companyName,
        category: serviceType,
        contactEmail,
        contactPhone: contactPhone || '',
        description: description || '',
        basePrice
      }
    })

    return NextResponse.json(vendor)
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
  }
}
