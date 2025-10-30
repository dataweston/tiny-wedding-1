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
