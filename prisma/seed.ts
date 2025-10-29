import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Simple Package
  const simplePackage = await prisma.package.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Simple Package',
      description: 'All-inclusive Tiny Wedding package at Tiny Diner',
      price: 5000,
      depositAmount: 1000,
      isFastPackage: true,
    },
  })

  console.log('✅ Created Simple Package:', simplePackage.name)

  // Create Package Services for Simple Package
  const services = [
    {
      serviceName: 'Event Coordination & Design',
      serviceDescription: 'Professional coordination and design by Alyssa Andes',
    },
    {
      serviceName: 'Exclusive Venue Use',
      serviceDescription: 'Tiny Diner venue for ceremony and cocktail hour (up to 50 guests)',
    },
    {
      serviceName: 'Furniture & Setup',
      serviceDescription: 'Ceremony and cocktail hour furniture and setup',
    },
    {
      serviceName: 'Catering',
      serviceDescription: 'Seasonal hors d\'oeuvres by Local Effort',
    },
    {
      serviceName: 'Beverage Package',
      serviceDescription: 'Curated drinks and professional bar staff',
    },
    {
      serviceName: 'Floral Design',
      serviceDescription: 'Seasonal ceremony installation, bouquet, and boutonniere',
    },
    {
      serviceName: 'Officiant Services',
      serviceDescription: 'Licensed officiant for your ceremony',
    },
    {
      serviceName: 'Photography',
      serviceDescription: 'Ceremony, cocktail hour, and couple\'s portraits',
    },
  ]

  for (const service of services) {
    await prisma.packageService.create({
      data: {
        packageId: simplePackage.id,
        ...service,
      },
    })
  }

  console.log('✅ Created 8 services for Simple Package')

  // Create sample vendors for Build Your Own
  const vendorCategories = [
    { category: 'Photography', businessName: 'Moments Photography', basePrice: 1200, description: 'Professional wedding photography capturing your special moments' },
    { category: 'Videography', businessName: 'Cinematic Stories', basePrice: 1500, description: 'High-quality wedding videography and editing' },
    { category: 'Catering', businessName: 'Local Effort', basePrice: 2000, description: 'Farm-to-table seasonal catering' },
    { category: 'Florals', businessName: 'Bloom Studio', basePrice: 800, description: 'Custom floral arrangements and installations' },
    { category: 'DJ', businessName: 'Spin City DJs', basePrice: 600, description: 'Professional DJ services with extensive music library' },
    { category: 'Bar Service', businessName: 'Crafted Cocktails', basePrice: 500, description: 'Professional bartending and curated beverage packages' },
    { category: 'Officiant', businessName: 'Reverend Sarah Johnson', basePrice: 300, description: 'Licensed officiant for personalized ceremonies' },
    { category: 'Venue', businessName: 'Tiny Diner', basePrice: 1500, description: 'Intimate venue space in Minneapolis' },
  ]

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tinyweddings.com' },
    update: {},
    create: {
      email: 'admin@tinyweddings.com',
      fullName: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create vendor users and vendors
  for (const vendorData of vendorCategories) {
    const vendorEmail = `${vendorData.businessName.toLowerCase().replace(/\s+/g, '')}@example.com`

    const vendorUser = await prisma.user.upsert({
      where: { email: vendorEmail },
      update: {},
      create: {
        email: vendorEmail,
        fullName: vendorData.businessName,
        role: 'VENDOR',
      },
    })

    await prisma.vendor.upsert({
      where: { userId: vendorUser.id },
      update: {},
      create: {
        userId: vendorUser.id,
        businessName: vendorData.businessName,
        category: vendorData.category,
        description: vendorData.description,
        basePrice: vendorData.basePrice,
        contactEmail: vendorEmail,
        contactPhone: '(555) 123-4567',
        isActive: true,
      },
    })
  }

  console.log('✅ Created 8 sample vendors')

  // Create sample client user
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      fullName: 'Jane & John Doe',
      role: 'CLIENT',
    },
  })

  console.log('✅ Created sample client user:', clientUser.email)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
