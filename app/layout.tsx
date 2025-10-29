import type { Metadata } from 'next'
import { Tangerine, Caveat, Patrick_Hand } from 'next/font/google'
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

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick-hand',
})

export const metadata: Metadata = {
  title: 'Tiny Weddings - Intimate Wedding Packages at Tiny Diner',
  description:
    'Celebrate your love with our curated wedding packages. From full-service Simple Package to custom Build Your Own options.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${tangerine.variable} ${caveat.variable} ${patrickHand.variable}`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}

