import { Metadata } from 'next'
import { calendarMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = calendarMetadata

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
