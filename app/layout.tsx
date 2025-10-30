import type { Metadata } from 'next'
import { Tangerine, Caveat, Patrick_Hand_SC, Inter } from 'next/font/google'
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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
      <body className={`${inter.variable} ${tangerine.variable} ${caveat.variable} ${patrickHandSc.variable}`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
