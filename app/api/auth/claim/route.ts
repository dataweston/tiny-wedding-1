import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user || !user.email) {
      return NextResponse.json({ authenticated: false })
    }

    // Upsert Prisma user by email so bookings held with that email map correctly
    const email = user.email
    const fullName = (user.user_metadata as any)?.full_name ?? (user.user_metadata as any)?.name ?? ''

    const prismaUser = await prisma.user.upsert({
      where: { email },
      update: { fullName: fullName || undefined },
      create: { email, fullName: fullName || '', role: 'CLIENT' }
    })

    // Return any active holds / dashboards for that user
    const bookings = await prisma.booking.findMany({
      where: { clientId: prismaUser.id }
    })

    const dashboards = await prisma.clientDashboard.findMany({
      where: { clientId: prismaUser.id }
    })

    return NextResponse.json({ authenticated: true, user: prismaUser, bookings, dashboards })
  } catch (error) {
    console.error('Claim error', error)
    return NextResponse.json({ error: 'Claim failed' }, { status: 500 })
  }
}
