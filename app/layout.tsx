import type { Metadata } from 'next'
import { Tangerine, Caveat, Patrick_Hand_SC } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Navigation } from '@/components/navigation'

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tangerine',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
})

const patrickHandSc = Patrick_Hand_SC({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick-hand-sc',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tinyweddings.com'),
  title: {
    default: 'Tiny Weddings - Intimate Wedding Packages in Minneapolis',
    template: '%s | Tiny Weddings',
  },
  description:
    'Celebrate your love with our curated wedding packages in Minneapolis, MN. From full-service Simple Package ($5,000) to custom Build Your Own options. Professional coordination, beautiful venues, and unforgettable memories.',
  keywords: [
    'tiny weddings',
    'intimate wedding',
    'small wedding',
    'Minneapolis wedding',
    'wedding packages',
    'wedding venue Minneapolis',
    'micro wedding',
    'elopement packages',
    'Tiny Diner wedding',
    'wedding coordination Minneapolis',
  ],
  authors: [{ name: 'Tiny Weddings' }],
  creator: 'Tiny Weddings',
  publisher: 'Tiny Weddings',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Tiny Weddings',
    title: 'Tiny Weddings - Intimate Wedding Packages in Minneapolis',
    description:
      'Celebrate your love with our curated wedding packages in Minneapolis, MN. From full-service Simple Package ($5,000) to custom Build Your Own options.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tiny Weddings - Intimate Wedding Packages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiny Weddings - Intimate Wedding Packages in Minneapolis',
    description:
      'Celebrate your love with our curated wedding packages in Minneapolis, MN. From full-service Simple Package ($5,000) to custom Build Your Own options.',
    images: ['/og-image.jpg'],
    creator: '@tinyweddings',
  },
  robots: {
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-P0Q3W8KEKY" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P0Q3W8KEKY');
            `,
          }}
        />
      </head>
      <body className={`${tangerine.variable} ${caveat.variable} ${patrickHandSc.variable}`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
