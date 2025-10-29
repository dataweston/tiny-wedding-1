'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AvailabilityCalendar } from '@/components/availability-calendar'
import { formatDate } from '@/lib/utils'
import { ArrowRight } from 'iconoir-react'

function CalendarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const packageType = searchParams.get('package') || 'fast'
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Force sign up instead of showing modal
  const handleHoldClick = () => {
    if (!selectedDate) return
    // Pass date and package as direct params, not nested in redirect URL
    router.push(`/signup?package=${packageType}&date=${selectedDate.toISOString().split('T')[0]}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Select Your Wedding Date</h1>
          <p className="text-xl text-gray-600">
            {packageType === 'fast' ? 'Simple Package' : 'Build Your Own'} - Choose an available date
          </p>
          <p className="text-gray-500 mt-2">
            Hold your date for 12 hours while you shop - $1,000 deposit required to finalize
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
            <div className="space-y-3">
              <Button onClick={handleHoldClick} size="lg" className="w-full">
                Hold Date (12 hours)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

      {/* HoldModal removed, force sign up instead. */}

        <div className="text-center">
          <Link href="/packages">
            <Button variant="ghost">
              Back to Packages
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
