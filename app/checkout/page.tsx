'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckoutForm } from '@/components/checkout-form'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Check } from 'lucide-react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const packageType = (searchParams.get('package') || 'fast') as 'fast' | 'custom'
  const eventDate = searchParams.get('date') || ''

  const handleSuccess = (bookingId: string) => {
    router.push(`/confirmation?booking=${bookingId}`)
  }

  if (!eventDate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No date selected</p>
        <Link href="/calendar">
          <Button>Select a Date</Button>
        </Link>
      </div>
    )
  }

  const selectedDate = new Date(eventDate)

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Complete Your Booking</h1>
          <p className="text-xl text-gray-600">
            {packageType === 'fast' ? 'Fast Package' : 'Build Your Own'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Wedding Date</div>
                  <div className="text-lg font-semibold">{formatDate(selectedDate)}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Package</div>
                  <div className="text-lg font-semibold">
                    {packageType === 'fast' ? 'Fast Package' : 'Build Your Own'}
                  </div>
                </div>

                {packageType === 'fast' && (
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Included Services:</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>Event coordination by Soup Sisters</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>Exclusive Tiny Diner venue</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>Catering & bar service</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>Florals & photography</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>Officiant services</span>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="border-t pt-4 space-y-2">
                  {packageType === 'fast' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Package Price</span>
                      <span className="font-medium">{formatCurrency(5000)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Deposit Due Today</span>
                    <span className="text-rose-600">{formatCurrency(1000)}</span>
                  </div>
                  {packageType === 'fast' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Balance Due (30 days before event)</span>
                      <span>{formatCurrency(4000)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <CheckoutForm
              packageType={packageType}
              eventDate={eventDate}
              onSuccess={handleSuccess}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href={`/calendar?package=${packageType}`}>
            <Button variant="ghost">
              ← Back to Calendar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
