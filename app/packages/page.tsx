'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, ArrowRight, Calendar } from 'iconoir-react'

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Package</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect option for your celebration. Both packages require a $1,000 deposit to hold your date.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Simple Package */}
          <Card className="border-2 border-rose-500 relative">
            <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <CardHeader>
              <CardTitle className="text-3xl">Simple Package</CardTitle>
              <CardDescription className="text-lg">
                All-inclusive, stress-free planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-5xl font-bold text-rose-600 mb-2">$5,000</div>
                <p className="text-gray-600">$1,000 deposit • $4,000 balance</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What&apos;s Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Event coordination & design by Alyssa Andes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Exclusive use of Tiny Diner (ceremony + cocktail hour)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Ceremony & cocktail hour furniture + setup</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Seasonal hors d&apos;oeuvres by Local Effort</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Curated beverage package + pro bar staff</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Seasonal florals (installation, bouquet, boutonniere)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Licensed officiant services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Photography (ceremony, cocktails, portraits)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 space-y-3">
                <Link href="/calendar?package=fast">
                  <Button className="w-full" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Check Availability
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 text-center">
                  Perfect for up to 35 guests
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Build Your Own */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Build Your Own</CardTitle>
              <CardDescription className="text-lg">
                Customize every detail your way
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-5xl font-bold text-gray-900 mb-2">Custom</div>
                <p className="text-gray-600">$1,000 deposit • Variable balance</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What You Get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Select your preferred vendors</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Choose specific services you need</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Interactive dashboard with real-time pricing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Direct messaging with vendors</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Add or remove services anytime</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Autosave - never lose your progress</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Visible to admin for support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Flexible guest count</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 space-y-3">
                <Link href="/calendar?package=custom">
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Check Availability
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 text-center">
                  Perfect for up to 85 guests
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="ghost">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
