import { Metadata } from 'next'
import { confirmationMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = confirmationMetadata

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
