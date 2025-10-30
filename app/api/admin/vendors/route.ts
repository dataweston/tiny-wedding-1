import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/admin'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: Request) {
  try {
    // Check admin authorization
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const {
      companyName,
      serviceType,
      contactEmail,
      contactPhone,
      basePrice,
      description,
      bio,
      perPersonCost,
      packageMinimum,
      websiteUrl,
      instagramUrl,
      facebookUrl,
      portfolioUrl
    } = await request.json()

    // Create user for vendor
    const vendorUser = await prisma.user.create({
      data: {
        email: contactEmail,
        fullName: companyName,
        role: 'VENDOR'
      }
    })

    // Create vendor
    const vendor = await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
        businessName: companyName,
        category: serviceType,
        contactEmail,
        contactPhone: contactPhone || '',
        description: description || '',
        bio: bio || null,
        basePrice,
        perPersonCost: perPersonCost || null,
        packageMinimum: packageMinimum || null,
        websiteUrl: websiteUrl || null,
        instagramUrl: instagramUrl || null,
        facebookUrl: facebookUrl || null,
        portfolioUrl: portfolioUrl || null
      }
    })

    return NextResponse.json(vendor)
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
  }
}
