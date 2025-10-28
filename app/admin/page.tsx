'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Users, Building2, DollarSign, Plus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'

interface Booking {
  id: string
  eventDate: string
  packageType: string
  client: {
    name: string
    email: string
  }
  status: string
  totalCost: number
}

interface Dashboard {
  id: string
  client: {
    name: string
    email: string
  }
  booking: {
    eventDate: string
  }
  totalCost: number
  status: string
  servicesCount: number
}

interface Vendor {
  id: string
  companyName: string
  serviceType: string
  contactEmail: string
  basePrice: number
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [showVendorForm, setShowVendorForm] = useState(false)
  const [newVendor, setNewVendor] = useState({
    companyName: '',
    serviceType: '',
    contactEmail: '',
    basePrice: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchBookings(), fetchDashboards(), fetchVendors()])
      setLoading(false)
    }

    fetchData()

    // Set up real-time subscriptions
    const bookingsChannel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => {
        fetchBookings()
      })
      .subscribe()

    const dashboardsChannel = supabase
      .channel('admin-dashboards')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'client_dashboards'
      }, () => {
        fetchDashboards()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(bookingsChannel)
      supabase.removeChannel(dashboardsChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchDashboards = async () => {
    try {
      const response = await fetch('/api/admin/dashboards')
      const data = await response.json()
      setDashboards(data)
    } catch (error) {
      console.error('Error fetching dashboards:', error)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors')
      const data = await response.json()
      setVendors(data)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const createVendor = async () => {
    try {
      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVendor,
          basePrice: parseInt(newVendor.basePrice)
        })
      })

      if (response.ok) {
        setNewVendor({ companyName: '', serviceType: '', contactEmail: '', basePrice: '' })
        setShowVendorForm(false)
        fetchVendors()
      }
    } catch (error) {
      console.error('Error creating vendor:', error)
    }
  }

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalCost + 1000, 0)
  const depositsPaid = bookings.length * 1000

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Dashboards</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboards.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Building2 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendors.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Deposits Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                ${depositsPaid.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="dashboards">Client Dashboards</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Client</th>
                        <th className="text-left p-2">Package</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-right p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                          </td>
                          <td className="p-2">
                            <div>{booking.client.name}</div>
                            <div className="text-sm text-gray-600">{booking.client.email}</div>
                          </td>
                          <td className="p-2 capitalize">{booking.packageType.replace('_', ' ')}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {booking.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-2 text-right font-semibold">
                            ${(booking.totalCost + 1000).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboards">
            <Card>
              <CardHeader>
                <CardTitle>Client Dashboards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboards.map((dashboard) => (
                    <Card key={dashboard.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold">{dashboard.client.name}</div>
                            <div className="text-sm text-gray-600">{dashboard.client.email}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Wedding: {format(new Date(dashboard.booking.eventDate), 'MMM d, yyyy')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {dashboard.servicesCount} services selected
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-rose-600">
                              ${dashboard.totalCost.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {dashboard.status.toLowerCase().replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vendors</CardTitle>
                  <Button onClick={() => setShowVendorForm(!showVendorForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showVendorForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">New Vendor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          value={newVendor.companyName}
                          onChange={(e) => setNewVendor({ ...newVendor, companyName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Input
                          value={newVendor.serviceType}
                          onChange={(e) => setNewVendor({ ...newVendor, serviceType: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input
                          type="email"
                          value={newVendor.contactEmail}
                          onChange={(e) => setNewVendor({ ...newVendor, contactEmail: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Base Price</Label>
                        <Input
                          type="number"
                          value={newVendor.basePrice}
                          onChange={(e) => setNewVendor({ ...newVendor, basePrice: e.target.value })}
                        />
                      </div>
                      <Button onClick={createVendor}>Create Vendor</Button>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {vendors.map((vendor) => (
                    <Card key={vendor.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{vendor.companyName}</CardTitle>
                        <p className="text-sm text-gray-600">{vendor.serviceType}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{vendor.contactEmail}</p>
                        <div className="text-lg font-bold text-rose-600">
                          ${vendor.basePrice.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
