'use client'

import { useState } from 'react'
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { processDeposit } from '@/app/actions/payment'

interface CheckoutFormProps {
  packageType: 'fast' | 'custom'
  eventDate: string
  onSuccess: (bookingId: string) => void
}

export function CheckoutForm({ packageType, eventDate, onSuccess }: CheckoutFormProps) {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Secure $1,000 deposit to hold your date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="jane@example.com"
            required
          />
        </div>

        {clientName && clientEmail && (
          <div className="pt-4">
            <PaymentForm
              applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
              locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              cardTokenizeResponseReceived={async (token) => {
                setLoading(true)
                setError('')
                
                const result = await processDeposit({
                  sourceId: token.token!,
                  eventDate,
                  packageType,
                  clientEmail,
                  clientName
                })

                if (result.success && result.bookingId) {
                  onSuccess(result.bookingId)
                } else {
                  setError(result.error || 'Payment failed. Please try again.')
                }
                setLoading(false)
              }}
            >
              <CreditCard />
            </PaymentForm>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-600">
            Processing payment...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
