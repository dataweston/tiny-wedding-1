import { Metadata } from 'next'
import { messagesMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = messagesMetadata

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
