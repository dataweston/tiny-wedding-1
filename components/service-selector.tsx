'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Xmark, Plus, Search } from 'iconoir-react'

interface Vendor {
  id: string
  companyName: string
  serviceType: string
  basePrice: number
  description: string
}

interface ServiceSelectorProps {
  dashboardId: string
  onClose: () => void
}

const serviceCategories = [
  'Catering',
  'Photography',
  'Videography',
  'DJ/Music',
  'Flowers',
  'Cake',
  'Rentals',
  'Transportation',
  'Other'
]

export function ServiceSelector({ dashboardId, onClose }: ServiceSelectorProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadVendors = async () => {
      setLoading(true)
      try {
        const url = selectedCategory
          ? `/api/vendors?category=${selectedCategory}`
          : '/api/vendors'
        const response = await fetch(url)
        const data = await response.json()
        setVendors(data)
      } catch (error) {
        console.error('Error fetching vendors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVendors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  const addService = async (vendor: Vendor) => {
    try {
      const response = await fetch(`/api/dashboard/${dashboardId}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendor.id,
          service: vendor.serviceType,
          description: vendor.description,
          cost: vendor.basePrice
        })
      })

      if (response.ok) {
        onClose()
      }
    } catch (error) {
      console.error('Error adding service:', error)
    }
  }

  const filteredVendors = vendors.filter(vendor =>
    vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Add Services</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Xmark className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="p-6 border-b">
          <div className="mb-4">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search vendors or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {serviceCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading vendors...</div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No vendors found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{vendor.companyName}</CardTitle>
                    <p className="text-sm text-gray-600">{vendor.serviceType}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      {vendor.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-rose-600">
                        ${vendor.basePrice.toLocaleString()}
                      </div>
                      <Button size="sm" onClick={() => addService(vendor)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
