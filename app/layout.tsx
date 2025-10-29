import type { Metadata } from 'next'
import {
  Tangerine,
  Reenie_Beanie,
  Caveat,
  Patrick_Hand,
} from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
})

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tangerine',
})

const reenieBeanie = Reenie_Beanie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-reenie-beanie',
})

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick-hand',
})

export const metadata: Metadata = {
  title: 'Tiny Weddings - Intimate Wedding Packages at Tiny Diner',
  description: 'Celebrate your love with our curated wedding packages. From full-service Simple Package to custom Build Your Own options.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${caveat.className} ${tangerine.variable} ${reenieBeanie.variable} ${patrickHand.variable}`}
      >
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
