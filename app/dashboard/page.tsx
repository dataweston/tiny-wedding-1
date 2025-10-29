'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarCircle, MessageText, Plus, Xmark, ShieldLoading, CheckCircle, Wallet } from 'iconoir-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { ServiceSelector } from '@/components/service-selector'
import { useDebounce } from 'use-debounce'
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk'
import { payDepositForBooking } from '@/app/actions/payment'

interface DashboardService {
  id: string
  service: string
  vendorName: string
  description: string
  cost: number
}

interface DashboardData {
  id: string
  booking: {
    id: string
    eventDate: string
    isFastPackage: boolean
    depositPaid?: boolean
    heldUntil?: string | null
  }
  questionnaireData: any
  totalCost: number
  services: DashboardService[]
  status: string
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dashboardId = searchParams.get('id')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showServiceSelector, setShowServiceSelector] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [debouncedDashboard] = useDebounce(dashboard, 500)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    if (dashboardId) {
      return
    }

    const resolveDashboard = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/auth/claim', { credentials: 'include' })
        if (!response.ok) {
          throw new Error('Failed to resolve dashboards')
        }

        const payload = await response.json()
        const dashboards: Array<{ id: string; updatedAt?: string; createdAt?: string }> = Array.isArray(
          payload?.dashboards
        )
          ? payload.dashboards
          : []

        if (dashboards.length > 0) {
          const [latestDashboard] = dashboards
            .slice()
            .sort(
              (a, b) =>
                new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
                new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
            )

          router.replace(`/dashboard?id=${latestDashboard.id}`)
          return
        }

        router.replace('/packages')
      } catch (error) {
        console.error('Unable to resolve dashboard redirect:', error)
        router.replace('/')
      }
    }

    resolveDashboard()
  }, [dashboardId, router])

  useEffect(() => {
    if (!dashboardId) {
      return
    }

    setLoading(true)

    // Fetch initial dashboard data
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`/api/dashboard/${dashboardId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard')
        }
        const data = await response.json()
        setDashboard(data)
      } catch (error) {
        console.error('Error fetching dashboard:', error)
        setDashboard(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()

    // Set up real-time subscription
    const channel = supabase
      .channel(`dashboard-${dashboardId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dashboard_services',
        filter: `dashboard_id=eq.${dashboardId}`
      }, () => {
        // Refresh dashboard when services change
        fetchDashboard()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'client_dashboards',
        filter: `id=eq.${dashboardId}`
      }, () => {
        // Refresh when dashboard updates
        fetchDashboard()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [dashboardId])

  // Claim holds / ensure Prisma user exists when a user signs in via Supabase
  useEffect(() => {
    const claim = async () => {
      try {
        await fetch('/api/auth/claim', { credentials: 'include' })
      } catch (err) {
        // non-fatal
      }
    }
    claim()
  }, [])

  // Autosave effect
  useEffect(() => {
    if (!debouncedDashboard || !dashboardId) return

    const saveChanges = async () => {
      setSaving(true)
      try {
        await fetch(`/api/dashboard/${dashboardId}/autosave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalCost: debouncedDashboard.totalCost,
            status: debouncedDashboard.status
          })
        })
        setLastSaved(new Date())
      } catch (error) {
        console.error('Autosave error:', error)
      } finally {
        setSaving(false)
      }
    }

    saveChanges()
  }, [debouncedDashboard, dashboardId])

  const removeService = async (serviceId: string) => {
    try {
      await fetch(`/api/dashboard/${dashboardId}/services/${serviceId}`, {
        method: 'DELETE'
      })
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error removing service:', error)
    }
  }

  const handlePaymentSubmit = async (token: any) => {
    setPaymentProcessing(true)
    setPaymentError('')

    try {
      const result = await payDepositForBooking({
        sourceId: token.token,
        bookingId: dashboard!.booking.id
      })

      if (result.success) {
        // Refresh dashboard data to show updated payment status
        const response = await fetch(`/api/dashboard/${dashboardId}`)
        const data = await response.json()
        setDashboard(data)
        setShowPaymentForm(false)
      } else {
        setPaymentError(result.error || 'Payment failed')
      }
    } catch (error) {
      setPaymentError('Payment processing error')
      console.error('Payment error:', error)
    } finally {
      setPaymentProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ShieldLoading className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Dashboard not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Wedding Dashboard</h1>
              <p className="text-xl text-gray-600">
                Plan your perfect celebration
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {saving ? (
                <>
                  <ShieldLoading className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Saved {format(lastSaved, 'h:mm a')}
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wedding Date</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {format(new Date(dashboard.booking.eventDate), 'MMMM d, yyyy')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Total</CardTitle>
              <DollarCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                ${dashboard.totalCost.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {dashboard.booking.depositPaid ? (
                  '+ $1,000 deposit already paid'
                ) : dashboard.booking.heldUntil && new Date(dashboard.booking.heldUntil) > new Date() ? (
                  `Date held until ${format(new Date(dashboard.booking.heldUntil), 'MMMM d, h:mm a')}`
                ) : (
                  '$1,000 deposit required to secure date'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <MessageText className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {dashboard.status.toLowerCase().replace('_', ' ')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deposit Payment Banner - Show if deposit not paid */}
        {!dashboard.booking.depositPaid && (
          <Card className="mb-8 border-2 border-rose-500 bg-rose-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-900">
                <Wallet className="h-5 w-5" />
                Secure Your Date - Pay Deposit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your date is currently held until{' '}
                  <span className="font-semibold">
                    {dashboard.booking.heldUntil
                      ? format(new Date(dashboard.booking.heldUntil), 'MMMM d, h:mm a')
                      : 'the hold expires'}
                  </span>
                  . Pay the $1,000 deposit now to confirm your booking.
                </p>

                {!showPaymentForm ? (
                  <Button
                    onClick={() => setShowPaymentForm(true)}
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Pay $1,000 Deposit Now
                  </Button>
                ) : (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    {paymentError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {paymentError}
                      </div>
                    )}

                    <PaymentForm
                      applicationId={process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!}
                      locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
                      cardTokenizeResponseReceived={handlePaymentSubmit}
                    >
                      <CreditCard />
                      <Button
                        type="submit"
                        disabled={paymentProcessing}
                        className="w-full mt-4"
                      >
                        {paymentProcessing ? 'Processing...' : 'Pay $1,000 Deposit'}
                      </Button>
                    </PaymentForm>

                    <Button
                      variant="ghost"
                      onClick={() => setShowPaymentForm(false)}
                      className="w-full mt-2"
                      disabled={paymentProcessing}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Services</CardTitle>
              <Button onClick={() => setShowServiceSelector(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dashboard.services.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No services added yet. Get started by adding your first service!
                </p>
                <Button onClick={() => setShowServiceSelector(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Service
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {dashboard.services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{service.service}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            by {service.vendorName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(service.id)}
                        >
                          <Xmark className="w-4 h-4 text-gray-600" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        {service.description}
                      </p>
                      <div className="text-xl font-bold text-rose-600">
                        ${service.cost.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wedding Details */}
        <Card>
          <CardHeader>
            <CardTitle>Your Wedding Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-sm text-gray-600">
                  {dashboard.questionnaireData.contactPerson} & {dashboard.questionnaireData.partnerName}
                </p>
                <p className="text-sm text-gray-600">{dashboard.questionnaireData.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Guest Count</h3>
                <p className="text-sm text-gray-600">{dashboard.questionnaireData.guestCount} guests</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Vision</h3>
                <p className="text-sm text-gray-600">{dashboard.questionnaireData.visionDescription}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Budget</h3>
                <p className="text-sm text-gray-600">
                  ${parseInt(dashboard.questionnaireData.estimatedBudget).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.href = `/messages?dashboard=${dashboardId}`}>
            <MessageText className="w-4 h-4 mr-2" />
            Message Vendors
          </Button>
          <Button onClick={() => window.location.href = `/balance?booking=${dashboard.booking.id}`}>
            Finalize & Pay Balance
          </Button>
        </div>
      </div>

      {showServiceSelector && (
        <ServiceSelector
          dashboardId={dashboardId!}
          onClose={() => setShowServiceSelector(false)}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><ShieldLoading className="w-8 h-8 animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  )
}
