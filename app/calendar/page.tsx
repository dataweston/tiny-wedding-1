export const dynamic = 'force-dynamic'

'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AvailabilityCalendar } from '@/components/availability-calendar'
import { formatDate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

function CalendarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const packageType = searchParams.get('package') || 'fast'
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleContinue = () => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0]
      router.push(`/checkout?package=${packageType}&date=${dateStr}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Select Your Wedding Date</h1>
          <p className="text-xl text-gray-600">
            {packageType === 'fast' ? 'Fast Package' : 'Build Your Own'} - Choose an available date
          </p>
          <p className="text-gray-500 mt-2">
            $1,000 deposit required to hold your date
          </p>
        </div>

        <div className="mb-8">
          <AvailabilityCalendar 
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        {selectedDate && (
          <div className="bg-white border-2 border-rose-500 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Selected Date</h2>
            <p className="text-2xl text-rose-600 font-bold mb-4">
              {formatDate(selectedDate)}
            </p>
            <Button onClick={handleContinue} size="lg" className="w-full">
              Continue to Payment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        <div className="text-center">
          <Link href="/packages">
            <Button variant="ghost">
              ← Back to Packages
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalendarContent />
    </Suspense>
  )
}
