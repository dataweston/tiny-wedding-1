'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarCircle, ShieldLoading } from 'iconoir-react'
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk'

function BalancePaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('booking')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!bookingId) return

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`)
        const data = await response.json()
        setBooking(data)
      } catch (error) {
        console.error('Error fetching booking:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handlePayment = async (token: any) => {
    setProcessing(true)
    try {
      const response = await fetch('/api/payment/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          token: token.token
        })
      })

      if (response.ok) {
        router.push(`/confirmation?booking=${bookingId}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ShieldLoading className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Booking not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const balanceAmount = booking.isFastPackage
    ? 4000
    : Number(booking.clientDashboard?.totalCost || 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Balance Payment</h1>
          <p className="text-xl text-gray-600">
            Complete your wedding package payment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Paid</span>
                <span className="font-semibold">$1,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balance Due</span>
                <span className="font-semibold text-rose-600">
                  ${balanceAmount.toLocaleString()}.00
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Package Cost</span>
                  <span>${(balanceAmount + 1000).toLocaleString()}.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentForm
                applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID || ''}
                locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || ''}
                cardTokenizeResponseReceived={handlePayment}
              >
                <CreditCard />
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <ShieldLoading className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarCircle className="w-4 h-4 mr-2" />
                      Pay ${balanceAmount.toLocaleString()}
                    </>
                  )}
                </Button>
              </PaymentForm>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function BalancePaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><ShieldLoading className="w-8 h-8 animate-spin" /></div>}>
      <BalancePaymentContent />
    </Suspense>
  )
}
