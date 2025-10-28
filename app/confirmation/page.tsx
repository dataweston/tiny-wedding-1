'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Check, Download, Mail } from 'lucide-react'

interface Booking {
  id: string
  eventDate: string
  isFastPackage: boolean
  totalCost: number
  depositAmount: number
  balanceAmount: number
  depositPaymentId: string
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetchBooking(bookingId)
    }
  }, [bookingId])

  async function fetchBooking(id: string) {
    try {
      const response = await fetch(`/api/bookings/${id}`)
      const data = await response.json()
      setBooking(data)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Booking not found</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  const eventDate = new Date(booking.eventDate)

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Your wedding date is reserved
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Wedding Date</div>
                <div className="text-2xl font-bold text-rose-600">
                  {formatDate(eventDate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Package</div>
                <div className="text-lg font-semibold">
                  {booking.isFastPackage ? 'Fast Package' : 'Build Your Own'}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit Paid</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(booking.depositAmount)} ✓
                  </span>
                </div>
                {booking.isFastPackage && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balance Due (30 days before)</span>
                      <span className="font-semibold">
                        {formatCurrency(booking.balanceAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                      <span>Total Package Price</span>
                      <span>{formatCurrency(booking.totalCost)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fast Package Services */}
        {booking.isFastPackage && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What&apos;s Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Event coordination & design by Soup Sisters</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Exclusive Tiny Diner venue use</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Furniture & setup</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Seasonal hors d&apos;oeuvres</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Curated beverage package & bar staff</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Seasonal floral design</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Licensed officiant</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Photography package</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                <div>
                  <div className="font-semibold">Check your email</div>
                  <div className="text-sm text-gray-600">
                    We&apos;ve sent a confirmation with all the details
                  </div>
                </div>
              </li>
              {!booking.isFastPackage && (
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                  <div>
                    <div className="font-semibold">Complete your questionnaire</div>
                    <div className="text-sm text-gray-600">
                      Tell us about your vision and preferences
                    </div>
                  </div>
                </li>
              )}
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm mr-3">{!booking.isFastPackage ? '3' : '2'}</span>
                <div>
                  <div className="font-semibold">Meet with Soup Sisters</div>
                  <div className="text-sm text-gray-600">
                    Schedule your planning session
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm mr-3">{!booking.isFastPackage ? '4' : '3'}</span>
                <div>
                  <div className="font-semibold">Balance payment</div>
                  <div className="text-sm text-gray-600">
                    Due 30 days before your wedding
                  </div>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!booking.isFastPackage && (
            <Link href={`/questionnaire?booking=${booking.id}`}>
              <Button size="lg">
                Start Questionnaire
              </Button>
            </Link>
          )}
          <Button variant="outline" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" size="lg">
            <Mail className="w-5 h-5 mr-2" />
            Email Receipt
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
