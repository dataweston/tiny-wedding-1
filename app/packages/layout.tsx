import { Metadata } from 'next'
import { packagesMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = packagesMetadata

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
