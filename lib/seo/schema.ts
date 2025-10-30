/**
 * Schema.org structured data helpers for SEO
 * Generates JSON-LD markup for search engines
 */

import { Organization, LocalBusiness, Service, Event, WebSite, BreadcrumbList } from 'schema-dts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tinyweddings.com'
const BUSINESS_NAME = 'Tiny Weddings'
const BUSINESS_DESCRIPTION = 'Intimate wedding packages in Minneapolis, MN. From full-service Simple Package to custom Build Your Own options.'

/**
 * Generate LocalBusiness schema for the wedding service
 */
export function getLocalBusinessSchema(): LocalBusiness {
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    description: BUSINESS_DESCRIPTION,
    url: SITE_URL,
    telephone: '+1-XXX-XXX-XXXX', // TODO: Add actual phone number
    email: 'info@tinyweddings.com', // TODO: Add actual email
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tiny Diner', // TODO: Add actual street address
      addressLocality: 'Minneapolis',
      addressRegion: 'MN',
      postalCode: '55413', // TODO: Add actual postal code
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 44.9778, // TODO: Add actual coordinates
      longitude: -93.2650,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '10:00',
      closes: '20:00',
    },
    priceRange: '$$$$',
    image: `${SITE_URL}/og-image.jpg`,
    sameAs: [
      // TODO: Add social media profiles
      // 'https://www.facebook.com/tinyweddings',
      // 'https://www.instagram.com/tinyweddings',
    ],
  }
}

/**
 * Generate Organization schema
 */
export function getOrganizationSchema(): Organization {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: BUSINESS_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Minneapolis',
      addressRegion: 'MN',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@tinyweddings.com',
    },
  }
}

/**
 * Generate WebSite schema with search action
 */
export function getWebSiteSchema(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS_NAME,
    description: BUSINESS_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-US',
  }
}

/**
 * Generate Service schema for wedding packages
 */
export function getServiceSchema(serviceName: string, description: string, price: string | number): Service {
  return {
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'City',
      name: 'Minneapolis',
    },
    offers: {
      '@type': 'Offer',
      price: typeof price === 'number' ? price.toString() : price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/packages`,
    },
  }
}

/**
 * Generate Event schema for weddings
 */
export function getEventSchema(eventName: string, startDate: string, endDate: string): Event {
  return {
    '@type': 'Event',
    name: eventName,
    startDate: startDate,
    endDate: endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Tiny Diner',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Minneapolis',
        addressRegion: 'MN',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@id': `${SITE_URL}/#organization`,
    },
  }
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Helper to convert schema object to JSON-LD script tag
 */
export function generateSchemaScript(schema: any) {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      ...schema,
    }),
  }
}

/**
 * Combined schema for home page
 */
export function getHomePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getWebSiteSchema(),
      getLocalBusinessSchema(),
      getOrganizationSchema(),
      getServiceSchema(
        'Simple Wedding Package',
        'All-inclusive intimate wedding package for up to 35 guests including venue, catering, florals, photography, and officiant services.',
        5000
      ),
      getServiceSchema(
        'Build Your Own Wedding Package',
        'Customizable wedding package with vendor selection, interactive dashboard, and real-time pricing for intimate weddings.',
        'Variable'
      ),
    ],
  }
}

/**
 * Combined schema for packages page
 */
export function getPackagesPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getServiceSchema(
        'Simple Wedding Package',
        'All-inclusive intimate wedding package for up to 35 guests. Includes event coordination by Alyssa Andes, exclusive use of Tiny Diner, seasonal hors d\'oeuvres, curated beverage package, seasonal florals, licensed officiant, and photography coverage.',
        5000
      ),
      getServiceSchema(
        'Build Your Own Wedding Package',
        'Customizable wedding package for up to 85 guests. Choose your preferred vendors, select specific services, use interactive dashboard with real-time pricing, and message vendors directly.',
        'Variable'
      ),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Packages', url: '/packages' },
      ]),
    ],
  }
}
