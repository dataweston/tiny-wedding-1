'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const steps = [
  { id: 1, name: 'Client Information', fields: ['contactPerson', 'phone', 'partnerName'] },
  { id: 2, name: 'Wedding Details', fields: ['guestCount', 'visionDescription'] },
  { id: 3, name: 'Service Preferences', fields: ['cateringPreferences', 'musicPreferences'] },
  { id: 4, name: 'Budget & Timeline', fields: ['estimatedBudget', 'flexibleDates'] }
]

function QuestionnaireContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('booking')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    contactPerson: '',
    phone: '',
    partnerName: '',
    guestCount: '',
    visionDescription: '',
    cateringPreferences: '',
    musicPreferences: '',
    estimatedBudget: '',
    flexibleDates: ''
  })

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          questionnaireData: formData
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/dashboard?id=${data.dashboardId}`)
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canGoNext = () => {
    const currentFields = steps[currentStep - 1].fields
    return currentFields.every(field => formData[field as keyof typeof formData])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Tell Us About Your Wedding</h1>
          <p className="text-xl text-gray-600">
            Help us create your perfect celebration
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-rose-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Client Information */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Your Full Name</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => updateField('contactPerson', e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner&apos;s Full Name</Label>
                  <Input
                    id="partnerName"
                    value={formData.partnerName}
                    onChange={(e) => updateField('partnerName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </>
            )}

            {/* Step 2: Wedding Details */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="guestCount">Expected Number of Guests</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => updateField('guestCount', e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visionDescription">Describe Your Wedding Vision</Label>
                  <textarea
                    id="visionDescription"
                    value={formData.visionDescription}
                    onChange={(e) => updateField('visionDescription', e.target.value)}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Tell us about your ideal celebration..."
                  />
                </div>
              </>
            )}

            {/* Step 3: Service Preferences */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cateringPreferences">Catering Preferences</Label>
                  <textarea
                    id="cateringPreferences"
                    value={formData.cateringPreferences}
                    onChange={(e) => updateField('cateringPreferences', e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Dietary restrictions, cuisine preferences..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="musicPreferences">Music/Entertainment Preferences</Label>
                  <textarea
                    id="musicPreferences"
                    value={formData.musicPreferences}
                    onChange={(e) => updateField('musicPreferences', e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="DJ, live band, specific genres..."
                  />
                </div>
              </>
            )}

            {/* Step 4: Budget & Timeline */}
            {currentStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="estimatedBudget">Estimated Total Budget</Label>
                  <Input
                    id="estimatedBudget"
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={(e) => updateField('estimatedBudget', e.target.value)}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flexibleDates">Are your dates flexible?</Label>
                  <textarea
                    id="flexibleDates"
                    value={formData.flexibleDates}
                    onChange={(e) => updateField('flexibleDates', e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Any alternative dates or time preferences..."
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canGoNext()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canGoNext()}>
              Complete & View Dashboard
            </Button>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost">
              Save & Exit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionnaireContent />
    </Suspense>
  )
}
