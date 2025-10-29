#!/usr/bin/env node
/**
 * Vendor Seed Script
 *
 * This script seeds the database with vendor data.
 * Run this manually: node scripts/seed-vendors.js
 */

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const vendors = [
  // Floral
  {
    businessName: 'Captured Blossom',
    category: 'floral',
    description: 'Elegant floral arrangements for intimate weddings',
    basePrice: 800,
    contactEmail: 'info@capturedblossom.com',
    contactPhone: '(555) 123-4567',
    website: 'https://capturedblossom.com'
  },
  {
    businessName: 'Pansy Floral',
    category: 'floral',
    description: 'Seasonal blooms and creative floral design',
    basePrice: 750,
    contactEmail: 'hello@pansyfloral.com',
    contactPhone: '(555) 234-5678',
    website: 'https://pansyfloral.com'
  },
  {
    businessName: 'Cosmos Floral',
    category: 'floral',
    description: 'Sustainable and locally-sourced floral arrangements',
    basePrice: 700,
    contactEmail: 'contact@cosmosfloral.com',
    contactPhone: '(555) 345-6789',
    website: 'https://cosmosfloral.com'
  },

  // Beverage
  {
    businessName: 'Tiny Diner',
    category: 'beverage',
    description: 'Craft cocktails and local beer selection',
    basePrice: 600,
    contactEmail: 'events@tinydiner.com',
    contactPhone: '(555) 456-7890',
    website: 'https://tinydiner.com'
  },
  {
    businessName: 'New France',
    category: 'beverage',
    description: 'Premium wine selection and champagne service',
    basePrice: 800,
    contactEmail: 'weddings@newfrance.com',
    contactPhone: '(555) 567-8901',
    website: 'https://newfrance.com'
  },
  {
    businessName: 'Dry Wit',
    category: 'beverage',
    description: 'Craft beer and non-alcoholic beverage options',
    basePrice: 500,
    contactEmail: 'info@drywit.com',
    contactPhone: '(555) 678-9012',
    website: 'https://drywit.com'
  },
  {
    businessName: 'Lucille\'s',
    category: 'beverage',
    description: 'Signature cocktails and mocktail creations',
    basePrice: 650,
    contactEmail: 'events@lucilles.com',
    contactPhone: '(555) 789-0123',
    website: 'https://lucilles.com'
  },

  // Photography
  {
    businessName: 'Mikaela Harrod',
    category: 'photography',
    description: 'Intimate wedding photography with artistic flair',
    basePrice: 1200,
    contactEmail: 'mikaela@mikaelaharrod.com',
    contactPhone: '(555) 890-1234',
    website: 'https://mikaelaharrod.com'
  },
  {
    businessName: 'Kelly Russo',
    category: 'photography',
    description: 'Documentary-style wedding photography',
    basePrice: 1100,
    contactEmail: 'kelly@kellyrusso.com',
    contactPhone: '(555) 901-2345',
    website: 'https://kellyrusso.com'
  },
  {
    businessName: 'Delcy Garnaas',
    category: 'photography',
    description: 'Fine art wedding photography and portraits',
    basePrice: 1300,
    contactEmail: 'delcy@delcygarnaas.com',
    contactPhone: '(555) 012-3456',
    website: 'https://delcygarnaas.com'
  },
  {
    businessName: 'Gracie Scott',
    category: 'photography',
    description: 'Natural light photography for authentic moments',
    basePrice: 1000,
    contactEmail: 'gracie@graciescott.com',
    contactPhone: '(555) 123-4567',
    website: 'https://graciescott.com'
  },
  {
    businessName: 'Taylee Photos',
    category: 'photography',
    description: 'Creative wedding photography and videography',
    basePrice: 1400,
    contactEmail: 'taylee@tayleephotos.com',
    contactPhone: '(555) 234-5678',
    website: 'https://tayleephotos.com'
  }
];

async function seedVendors() {
  console.log('🌸 Seeding vendors...\n');

  try {
    for (const vendorData of vendors) {
      // Create a user account for each vendor
      const userEmail = vendorData.contactEmail;
      const userName = vendorData.businessName;

      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            fullName: userName,
            role: 'VENDOR'
          }
        });
        console.log(`👤 Created user: ${userName} (${userEmail})`);
      } else {
        console.log(`⚠️  User already exists: ${userName} (${userEmail})`);
      }

      // Check if vendor already exists
      const existingVendor = await prisma.vendor.findUnique({
        where: { userId: user.id }
      });

      if (!existingVendor) {
        const vendor = await prisma.vendor.create({
          data: {
            userId: user.id,
            businessName: vendorData.businessName,
            category: vendorData.category,
            description: vendorData.description,
            basePrice: vendorData.basePrice,
            contactEmail: vendorData.contactEmail,
            contactPhone: vendorData.contactPhone,
            website: vendorData.website,
            isActive: true
          }
        });
        console.log(`✅ Created vendor: ${vendorData.businessName} (${vendorData.category})`);
      } else {
        console.log(`⚠️  Vendor already exists: ${vendorData.businessName}`);
      }
    }

    console.log('\n🎉 Vendor seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedVendors();