'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
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

  // Fetch dashboard data - extracted as a reusable function
  const fetchDashboard = useCallback(async () => {
    if (!dashboardId) return

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
  }, [dashboardId])

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
  }, [dashboardId, fetchDashboard])

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

  const handleReleaseDate = async () => {
    if (!confirm('Are you sure you want to release this date? This will delete your booking and dashboard.')) {
      return
    }

    try {
      const response = await fetch(`/api/bookings/${dashboard.booking.id}/release`, {
        method: 'POST'
      })

      if (response.ok) {
        router.push('/packages')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to release date')
      }
    } catch (error) {
      console.error('Error releasing date:', error)
      alert('Failed to release date')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Dreamy Title */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
            Your Dream Wedding
          </h1>
          <p className="text-xl text-gray-700 italic">
            Let&apos;s bring your vision to life
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
            {saving ? (
              <>
                <ShieldLoading className="w-4 h-4 animate-spin text-rose-500" />
                <span>Saving your changes...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>All saved • {format(lastSaved, 'h:mm a')}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Key Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-amber-200 bg-white/80 backdrop-blur shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Your Special Day</CardTitle>
              <Calendar className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {format(new Date(dashboard.booking.eventDate), 'MMMM d, yyyy')}
              </div>
              {!dashboard.booking.depositPaid && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReleaseDate}
                  className="mt-3 text-xs border-amber-300 text-amber-700"
                >
                  Release Date
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-white/80 backdrop-blur shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Investment</CardTitle>
              <DollarCircle className="h-5 w-5 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                ${dashboard.totalCost.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {dashboard.booking.depositPaid ? (
                  <span className="text-emerald-600 font-medium">✓ $1,000 deposit paid</span>
                ) : dashboard.booking.heldUntil && new Date(dashboard.booking.heldUntil) > new Date() ? (
                  `Held until ${format(new Date(dashboard.booking.heldUntil), 'MMM d, h:mm a')}`
                ) : (
                  '$1,000 deposit to secure'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/80 backdrop-blur shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Planning Status</CardTitle>
              <MessageText className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize text-purple-600">
                {dashboard.status.toLowerCase().replace('_', ' ')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deposit Payment Banner - Show if deposit not paid */}
        {!dashboard.booking.depositPaid && (
          <Card className="mb-8 border-2 border-rose-400 bg-gradient-to-r from-rose-50 to-pink-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-800">
                <Wallet className="h-6 w-6" />
                Secure Your Dream Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-800 text-lg">
                  Your date is reserved until{' '}
                  <span className="font-bold text-rose-600">
                    {dashboard.booking.heldUntil
                      ? format(new Date(dashboard.booking.heldUntil), 'MMMM d, h:mm a')
                      : 'the hold expires'}
                  </span>
                  . Secure it now with your $1,000 deposit.
                </p>

                {!showPaymentForm ? (
                  <Button
                    onClick={() => setShowPaymentForm(true)}
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Pay $1,000 Deposit Now
                  </Button>
                ) : (
                  <div className="bg-white p-6 rounded-lg border-2 border-rose-200 shadow-md">
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

        {/* Services Section */}
        <Card className="mb-8 border-purple-200 bg-white/80 backdrop-blur shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-900">Your Wedding Team</CardTitle>
              <Button onClick={() => setShowServiceSelector(true)} className="bg-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dashboard.services.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto">
                  <p className="text-gray-600 text-lg mb-6">
                    Start building your dream team! Add the perfect vendors to bring your vision to life.
                  </p>
                  <Button onClick={() => setShowServiceSelector(true)} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="w-5 h-5 mr-2" />
                    Browse Vendors
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {dashboard.services.map((service) => (
                  <Card key={service.id} className="border-l-4 border-l-purple-400 bg-gradient-to-r from-white to-purple-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900">{service.service}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            by {service.vendorName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(service.id)}
                        >
                          <Xmark className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-3">
                        {service.description}
                      </p>
                      <div className="text-xl font-bold text-purple-600">
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
        <Card className="border-amber-200 bg-white/80 backdrop-blur shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Your Love Story Details</CardTitle>
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
          <Button variant="outline" onClick={() => router.push(`/messages?dashboard=${dashboardId}`)}>
            <MessageText className="w-4 h-4 mr-2" />
            Message Vendors
          </Button>
          <Button onClick={() => router.push(`/balance?booking=${dashboard.booking.id}`)}>
            Finalize & Pay Balance
          </Button>
        </div>
      </div>

      {showServiceSelector && (
        <ServiceSelector
          dashboardId={dashboardId!}
          onClose={() => setShowServiceSelector(false)}
          onServiceAdded={fetchDashboard}
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
