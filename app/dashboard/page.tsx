'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarCircle, MessageText, Plus, Xmark, ShieldLoading, CheckCircle } from 'iconoir-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { ServiceSelector } from '@/components/service-selector'
import { useDebounce } from 'use-debounce'

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
  const dashboardId = searchParams.get('id')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showServiceSelector, setShowServiceSelector] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [debouncedDashboard] = useDebounce(dashboard, 500)

  useEffect(() => {
    if (!dashboardId) {
      // Redirect to home if no dashboard id
      window.location.href = '/'
      return
    }

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
        await fetch('/api/auth/claim')
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
