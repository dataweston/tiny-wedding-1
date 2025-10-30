'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Group,
  Building,
  DollarCircle,
  Plus,
  ShieldLoading,
  Edit,
  Trash,
  Check,
  Xmark
} from 'iconoir-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { isAdmin } from '@/lib/admin'

interface Booking {
  id: string
  eventDate: string
  packageType: string
  client: {
    id: string
    name: string
    email: string
  }
  status: string
  totalCost: number
}

interface Dashboard {
  id: string
  client: {
    id: string
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
  contactPhone: string
  basePrice: number
  bio?: string
  perPersonCost?: number
  packageMinimum?: number
  websiteUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  portfolioUrl?: string
}

interface VendorForm {
  companyName: string
  serviceType: string
  contactEmail: string
  contactPhone: string
  basePrice: string
  bio: string
  perPersonCost: string
  packageMinimum: string
  websiteUrl: string
  instagramUrl: string
  facebookUrl: string
  portfolioUrl: string
}

export default function AdminPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showVendorForm, setShowVendorForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [vendorForm, setVendorForm] = useState<VendorForm>({
    companyName: '',
    serviceType: '',
    contactEmail: '',
    contactPhone: '',
    basePrice: '',
    bio: '',
    perPersonCost: '',
    packageMinimum: '',
    websiteUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    portfolioUrl: ''
  })

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || !isAdmin(user.email)) {
        router.push('/')
        return
      }

      setUserEmail(user.email || null)
      setIsAuthorized(true)
      fetchData()
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchBookings(), fetchDashboards(), fetchVendors()])
    setLoading(false)
  }

  useEffect(() => {
    if (!isAuthorized) return

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

    const vendorsChannel = supabase
      .channel('admin-vendors')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vendors'
      }, () => {
        fetchVendors()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(bookingsChannel)
      supabase.removeChannel(dashboardsChannel)
      supabase.removeChannel(vendorsChannel)
    }
  }, [isAuthorized])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const data = await response.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    }
  }

  const fetchDashboards = async () => {
    try {
      const response = await fetch('/api/admin/dashboards')
      const data = await response.json()
      setDashboards(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching dashboards:', error)
      setDashboards([])
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors')
      const data = await response.json()
      setVendors(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
      setVendors([])
    }
  }

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setVendorForm({
      companyName: vendor.companyName,
      serviceType: vendor.serviceType,
      contactEmail: vendor.contactEmail,
      contactPhone: vendor.contactPhone,
      basePrice: vendor.basePrice.toString(),
      bio: vendor.bio || '',
      perPersonCost: vendor.perPersonCost?.toString() || '',
      packageMinimum: vendor.packageMinimum?.toString() || '',
      websiteUrl: vendor.websiteUrl || '',
      instagramUrl: vendor.instagramUrl || '',
      facebookUrl: vendor.facebookUrl || '',
      portfolioUrl: vendor.portfolioUrl || ''
    })
    setShowVendorForm(true)
  }

  const resetVendorForm = () => {
    setEditingVendor(null)
    setVendorForm({
      companyName: '',
      serviceType: '',
      contactEmail: '',
      contactPhone: '',
      basePrice: '',
      bio: '',
      perPersonCost: '',
      packageMinimum: '',
      websiteUrl: '',
      instagramUrl: '',
      facebookUrl: '',
      portfolioUrl: ''
    })
    setShowVendorForm(false)
  }

  const saveVendor = async () => {
    try {
      const payload = {
        ...vendorForm,
        basePrice: parseFloat(vendorForm.basePrice) || 0,
        perPersonCost: vendorForm.perPersonCost ? parseFloat(vendorForm.perPersonCost) : null,
        packageMinimum: vendorForm.packageMinimum ? parseFloat(vendorForm.packageMinimum) : null
      }

      const url = editingVendor
        ? `/api/admin/vendors/${editingVendor.id}`
        : '/api/admin/vendors'

      const response = await fetch(url, {
        method: editingVendor ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        resetVendorForm()
        fetchVendors()
      }
    } catch (error) {
      console.error('Error saving vendor:', error)
    }
  }

  const deleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return

    try {
      const response = await fetch(`/api/admin/vendors/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchVendors()
      }
    } catch (error) {
      console.error('Error deleting vendor:', error)
    }
  }

  const deleteCustomer = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This will delete all their bookings and dashboards.')) return

    try {
      const response = await fetch(`/api/admin/customers/${clientId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchBookings()
        fetchDashboards()
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <ShieldLoading className="w-8 h-8 animate-spin text-amber-600" />
            <p className="text-gray-600">Verifying admin access...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.totalCost) + 1000, 0)
  const depositsPaid = bookings.length * 1000

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {userEmail}</p>
          </div>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-amber-200 bg-white/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-white/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active Dashboards</CardTitle>
              <Group className="h-4 w-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-600">{dashboards.length}</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Vendors</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{vendors.length}</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Deposits Collected</CardTitle>
              <DollarCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${depositsPaid.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur border border-gray-200">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="dashboards">Client Dashboards</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 text-gray-700 font-semibold">Date</th>
                        <th className="text-left p-3 text-gray-700 font-semibold">Client</th>
                        <th className="text-left p-3 text-gray-700 font-semibold">Package</th>
                        <th className="text-left p-3 text-gray-700 font-semibold">Status</th>
                        <th className="text-right p-3 text-gray-700 font-semibold">Total</th>
                        <th className="text-center p-3 text-gray-700 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100">
                          <td className="p-3">
                            {format(new Date(booking.eventDate), 'MMM d, yyyy')}
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{booking.client.name}</div>
                            <div className="text-sm text-gray-600">{booking.client.email}</div>
                          </td>
                          <td className="p-3 capitalize">{booking.packageType?.replace('_', ' ') || 'N/A'}</td>
                          <td className="p-3">
                            <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 font-medium">
                              {booking.status?.replace('_', ' ') || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3 text-right font-bold text-gray-900">
                            ${(booking.totalCost + 1000).toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCustomer(booking.client.id)}
                            >
                              <Trash className="w-4 h-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboards Tab */}
          <TabsContent value="dashboards">
            <Card className="bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Client Dashboards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboards.map((dashboard) => (
                    <Card key={dashboard.id} className="border-l-4 border-l-rose-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-lg text-gray-900">{dashboard.client.name}</div>
                            <div className="text-sm text-gray-600">{dashboard.client.email}</div>
                            <div className="text-sm text-gray-600 mt-2">
                              Wedding: {format(new Date(dashboard.booking.eventDate), 'MMM d, yyyy')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {dashboard.servicesCount} services selected
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-rose-600">
                              ${dashboard.totalCost.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 capitalize mt-1">
                              {dashboard.status.toLowerCase().replace('_', ' ')}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCustomer(dashboard.client.id)}
                              className="mt-2"
                            >
                              <Trash className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <Card className="bg-white/90 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">Vendors</CardTitle>
                  <Button onClick={() => { resetVendorForm(); setShowVendorForm(true); }} className="bg-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showVendorForm && (
                  <Card className="mb-6 border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{editingVendor ? 'Edit Vendor' : 'New Vendor'}</span>
                        <Button variant="ghost" size="sm" onClick={resetVendorForm}>
                          <Xmark className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name *</Label>
                        <Input
                          value={vendorForm.companyName}
                          onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                          placeholder="Vendor Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Service Type *</Label>
                        <Input
                          value={vendorForm.serviceType}
                          onChange={(e) => setVendorForm({ ...vendorForm, serviceType: e.target.value })}
                          placeholder="Catering, Photography, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Email *</Label>
                        <Input
                          type="email"
                          value={vendorForm.contactEmail}
                          onChange={(e) => setVendorForm({ ...vendorForm, contactEmail: e.target.value })}
                          placeholder="vendor@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Phone *</Label>
                        <Input
                          type="tel"
                          value={vendorForm.contactPhone}
                          onChange={(e) => setVendorForm({ ...vendorForm, contactPhone: e.target.value })}
                          placeholder="(555) 555-5555"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Base Price *</Label>
                        <Input
                          type="number"
                          value={vendorForm.basePrice}
                          onChange={(e) => setVendorForm({ ...vendorForm, basePrice: e.target.value })}
                          placeholder="1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Per Person Cost</Label>
                        <Input
                          type="number"
                          value={vendorForm.perPersonCost}
                          onChange={(e) => setVendorForm({ ...vendorForm, perPersonCost: e.target.value })}
                          placeholder="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Package Minimum</Label>
                        <Input
                          type="number"
                          value={vendorForm.packageMinimum}
                          onChange={(e) => setVendorForm({ ...vendorForm, packageMinimum: e.target.value })}
                          placeholder="500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Website URL</Label>
                        <Input
                          type="url"
                          value={vendorForm.websiteUrl}
                          onChange={(e) => setVendorForm({ ...vendorForm, websiteUrl: e.target.value })}
                          placeholder="https://vendor.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instagram URL</Label>
                        <Input
                          type="url"
                          value={vendorForm.instagramUrl}
                          onChange={(e) => setVendorForm({ ...vendorForm, instagramUrl: e.target.value })}
                          placeholder="https://instagram.com/vendor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Facebook URL</Label>
                        <Input
                          type="url"
                          value={vendorForm.facebookUrl}
                          onChange={(e) => setVendorForm({ ...vendorForm, facebookUrl: e.target.value })}
                          placeholder="https://facebook.com/vendor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Portfolio URL</Label>
                        <Input
                          type="url"
                          value={vendorForm.portfolioUrl}
                          onChange={(e) => setVendorForm({ ...vendorForm, portfolioUrl: e.target.value })}
                          placeholder="https://portfolio.com"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Bio</Label>
                        <textarea
                          className="w-full min-h-24 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                          value={vendorForm.bio}
                          onChange={(e) => setVendorForm({ ...vendorForm, bio: e.target.value })}
                          placeholder="Tell us about your business..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button onClick={saveVendor} className="w-full bg-purple-600">
                          <Check className="w-4 h-4 mr-2" />
                          {editingVendor ? 'Update Vendor' : 'Create Vendor'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {vendors.map((vendor) => (
                    <Card key={vendor.id} className="border-l-4 border-l-purple-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-gray-900">{vendor.companyName}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{vendor.serviceType}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVendor(vendor)}
                            >
                              <Edit className="w-4 h-4 text-amber-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteVendor(vendor.id)}
                            >
                              <Trash className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">{vendor.contactEmail}</p>
                          <p className="text-gray-600">{vendor.contactPhone}</p>
                          {vendor.bio && (
                            <p className="text-gray-700 mt-2 italic">{vendor.bio}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            {vendor.websiteUrl && (
                              <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600">
                                Website
                              </a>
                            )}
                            {vendor.instagramUrl && (
                              <a href={vendor.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600">
                                Instagram
                              </a>
                            )}
                            {vendor.portfolioUrl && (
                              <a href={vendor.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600">
                                Portfolio
                              </a>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t">
                            <div>
                              <div className="text-xs text-gray-600">Base Price</div>
                              <div className="font-bold text-purple-600">${vendor.basePrice.toLocaleString()}</div>
                            </div>
                            {vendor.perPersonCost && (
                              <div>
                                <div className="text-xs text-gray-600">Per Person</div>
                                <div className="font-bold text-purple-600">${vendor.perPersonCost.toLocaleString()}</div>
                              </div>
                            )}
                            {vendor.packageMinimum && (
                              <div>
                                <div className="text-xs text-gray-600">Minimum</div>
                                <div className="font-bold text-purple-600">${vendor.packageMinimum.toLocaleString()}</div>
                              </div>
                            )}
                          </div>
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
