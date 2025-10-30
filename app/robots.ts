import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tinyweddings.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/packages',
          '/calendar',
          '/checkout',
          '/confirmation',
          '/login',
          '/signup',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/messages',
          '/messages/*',
          '/balance',
          '/admin',
          '/admin/*',
          '/api/*',
          '/questionnaire',
          '/signup/email',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
