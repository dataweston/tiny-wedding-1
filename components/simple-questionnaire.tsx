'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Xmark } from 'iconoir-react'

interface SimpleQuestionnaireProps {
  bookingId: string
  onComplete?: (dashboardId: string) => void
  onCancel?: () => void
}

export function SimpleQuestionnaire({ bookingId, onComplete, onCancel }: SimpleQuestionnaireProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contactPerson: '',
    partnerName: '',
    phone: '',
    guestCount: '',
    visionDescription: '',
    estimatedBudget: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/questionnaire/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          questionnaireData: formData
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (onComplete) {
          onComplete(data.dashboardId)
        } else {
          router.push(`/dashboard?id=${data.dashboardId}`)
        }
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
      alert('Failed to save your information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isComplete = () => {
    return formData.contactPerson &&
           formData.partnerName &&
           formData.phone &&
           formData.guestCount
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-50 to-rose-50">
        <CardHeader className="border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl text-gray-900">Complete Your Booking</CardTitle>
              <p className="text-gray-600 mt-2">Just a few quick details to get started</p>
            </div>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <Xmark className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                Your Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-gray-700">Your Name *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => updateField('contactPerson', e.target.value)}
                    placeholder="First & Last Name"
                    required
                    className="border-amber-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerName" className="text-gray-700">Partner&apos;s Name *</Label>
                  <Input
                    id="partnerName"
                    value={formData.partnerName}
                    onChange={(e) => updateField('partnerName', e.target.value)}
                    placeholder="First & Last Name"
                    required
                    className="border-amber-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(555) 555-5555"
                  required
                  className="border-amber-200"
                />
              </div>
            </div>

            {/* Wedding Details */}
            <div className="space-y-4 pt-4 border-t border-amber-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                Wedding Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="guestCount" className="text-gray-700">Expected Guest Count *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => updateField('guestCount', e.target.value)}
                  placeholder="e.g., 25"
                  required
                  className="border-rose-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visionDescription" className="text-gray-700">
                  Your Wedding Vision <span className="text-gray-500 text-sm">(Optional)</span>
                </Label>
                <textarea
                  id="visionDescription"
                  value={formData.visionDescription}
                  onChange={(e) => updateField('visionDescription', e.target.value)}
                  placeholder="Share your dream wedding vision... romantic, fun, elegant, rustic, etc."
                  rows={4}
                  className="w-full rounded-md border border-rose-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedBudget" className="text-gray-700">
                  Estimated Budget <span className="text-gray-500 text-sm">(Optional)</span>
                </Label>
                <Input
                  id="estimatedBudget"
                  type="number"
                  value={formData.estimatedBudget}
                  onChange={(e) => updateField('estimatedBudget', e.target.value)}
                  placeholder="e.g., 5000"
                  className="border-rose-200"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 flex gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={!isComplete() || loading}
                className="flex-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 text-white font-semibold"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
