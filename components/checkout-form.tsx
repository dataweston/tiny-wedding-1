'use client'

import { useState } from 'react'
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Wallet } from 'iconoir-react'
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
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-rose-500" />
          Payment Information
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-gray-600">
          <Wallet className="h-4 w-4 text-amber-500" />
          Secure $1,000 deposit to hold your date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-rose-500" />
            Full Name
          </Label>
          <Input
            id="name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-rose-500" />
            Email
          </Label>
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
