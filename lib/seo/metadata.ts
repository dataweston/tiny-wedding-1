/**
 * SEO metadata helpers for Next.js 14
 * Provides consistent metadata generation across pages
 */

import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tinyweddings.com'
const SITE_NAME = 'Tiny Weddings'
const DEFAULT_TITLE = 'Tiny Weddings - Intimate Wedding Packages in Minneapolis'
const DEFAULT_DESCRIPTION = 'Celebrate your love with our curated wedding packages in Minneapolis, MN. From full-service Simple Package ($5,000) to custom Build Your Own options. Professional coordination, beautiful venues, and unforgettable memories.'

export const TWITTER_HANDLE = '@tinyweddings' // TODO: Update with actual Twitter handle
export const FACEBOOK_APP_ID = '' // TODO: Add if you have one

interface PageMetadataProps {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
}

/**
 * Generate comprehensive metadata for a page
 */
export function generatePageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = '/og-image.jpg',
  noIndex = false,
  keywords = [],
}: PageMetadataProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const canonicalUrl = `${SITE_URL}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  const defaultKeywords = [
    'tiny weddings',
    'intimate wedding',
    'small wedding',
    'Minneapolis wedding',
    'wedding packages',
    'wedding venue Minneapolis',
    'micro wedding',
    'elopement packages',
    'intimate ceremony',
    'wedding coordination',
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  const metadata: Metadata = {
    title: pageTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: pageTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || DEFAULT_TITLE,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [imageUrl],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    verification: {
      // TODO: Add verification codes when available
      // google: 'your-google-site-verification',
      // yandex: 'your-yandex-verification',
      // bing: 'your-bing-verification',
    },
  }

  return metadata
}

/**
 * Home page metadata
 */
export const homeMetadata = generatePageMetadata({
  title: 'Intimate Wedding Packages in Minneapolis',
  description: DEFAULT_DESCRIPTION,
  path: '/',
  keywords: [
    'Tiny Diner wedding',
    'Alyssa Andes wedding coordinator',
    'Minneapolis ceremony',
    '$5000 wedding package',
  ],
})

/**
 * Packages page metadata
 */
export const packagesMetadata = generatePageMetadata({
  title: 'Wedding Packages - Simple & Build Your Own',
  description: 'Choose between our $5,000 Simple Package (all-inclusive for 35 guests) or Build Your Own custom package (up to 85 guests). Real-time pricing, vendor selection, and interactive planning dashboard.',
  path: '/packages',
  keywords: [
    'wedding pricing',
    'package comparison',
    'custom wedding package',
    'all-inclusive wedding',
    '35 guest wedding',
    '85 guest wedding',
  ],
})

/**
 * Calendar page metadata
 */
export const calendarMetadata = generatePageMetadata({
  title: 'Check Availability - Wedding Calendar',
  description: 'View real-time availability for Tiny Weddings in Minneapolis. Check open dates for your intimate wedding ceremony and cocktail hour.',
  path: '/calendar',
  keywords: [
    'wedding availability',
    'book wedding date',
    'Minneapolis wedding dates',
    'wedding calendar',
  ],
})

/**
 * Checkout page metadata
 */
export const checkoutMetadata = generatePageMetadata({
  title: 'Secure Checkout - Book Your Wedding',
  description: 'Complete your wedding booking with secure payment processing. $1,000 deposit required to hold your date.',
  path: '/checkout',
  noIndex: false,
  keywords: ['wedding booking', 'secure payment', 'wedding deposit'],
})

/**
 * Confirmation page metadata
 */
export const confirmationMetadata = generatePageMetadata({
  title: 'Booking Confirmed - Thank You',
  description: 'Your Tiny Wedding booking is confirmed! Check your email for next steps and access to your planning dashboard.',
  path: '/confirmation',
  noIndex: true,
})

/**
 * Login page metadata
 */
export const loginMetadata = generatePageMetadata({
  title: 'Login to Your Dashboard',
  description: 'Access your Tiny Wedding planning dashboard. Manage your wedding details, message vendors, and track your package.',
  path: '/login',
  noIndex: true,
})

/**
 * Signup page metadata
 */
export const signupMetadata = generatePageMetadata({
  title: 'Create Your Account',
  description: 'Sign up for Tiny Weddings to start planning your intimate Minneapolis wedding. Get started in minutes.',
  path: '/signup',
  noIndex: true,
})

/**
 * Dashboard page metadata (protected)
 */
export const dashboardMetadata = generatePageMetadata({
  title: 'Your Wedding Dashboard',
  description: 'Plan your intimate wedding with our interactive dashboard. Select vendors, customize services, and track your budget in real-time.',
  path: '/dashboard',
  noIndex: true,
})

/**
 * Messages page metadata (protected)
 */
export const messagesMetadata = generatePageMetadata({
  title: 'Vendor Messages',
  description: 'Communicate directly with your wedding vendors through our messaging system.',
  path: '/messages',
  noIndex: true,
})
