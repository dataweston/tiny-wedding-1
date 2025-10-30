import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/admin'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

async function checkAdminAuth() {
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
  return user && isAdmin(user.email)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!await checkAdminAuth()) {
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

    // Update vendor
    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: {
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
    console.error('Error updating vendor:', error)
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete vendor (will cascade delete user due to onDelete: Cascade)
    await prisma.vendor.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
  }
}
