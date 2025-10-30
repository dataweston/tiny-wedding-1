'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, ArrowRight, Calendar } from 'iconoir-react'
import { SparklesCore } from '@/components/ui/sparkles'
import Image from 'next/image'
import heroPackages from '@/lib/resource/IMG_7064.jpg'
import { getPackagesPageSchema } from '@/lib/seo/schema'

export default function PackagesPage() {
  const schema = getPackagesPageSchema()
  return (
    <main className="min-h-screen bg-surface">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-primary-container/10 to-surface">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={80}
          className="absolute inset-0 w-full h-full"
          particleColor="#f97316"
          speed={0.6}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="flex justify-center mb-8 md:mb-12">
            <Image
              src={heroPackages}
              alt="Vertical view of the Tiny Weddings celebration"
              width={675}
              height={900}
              className="h-[300px] sm:h-[400px] md:h-[450px] w-auto object-contain"
              priority
            />
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-foreground mb-4">Choose Your Package</h1>
            <p className="text-lg text-on-surface/80">
              Select the perfect option for your celebration. Both packages require a
              $1,000 deposit to hold your date.
            </p>
          </div>

          <div className="mt-8 md:mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
              {/* Simple Package */}
              <Card className="md-state-layer md-state-layer-tertiary bg-surface-container-high border-2 border-tertiary hover:shadow-elevation-3 transition-shadow duration-[var(--md-sys-motion-duration-medium-2)] ease-emphasized relative">
                <div className="absolute top-4 right-4 bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-patrick-hand-sc)] text-2xl text-on-surface">Simple Package</CardTitle>
                  <CardDescription className="text-sm text-on-surface-variant">
                    All-inclusive, stress-free planning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-display-medium font-expressive text-tertiary mb-2">$5,000</div>
                    <p className="text-body-medium text-on-surface-variant">$1,000 deposit - $4,000 balance</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-title-medium font-baseline font-semibold text-on-surface">What&apos;s Included:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Event coordination & design by Alyssa Andes</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Exclusive use of Tiny Diner (ceremony + cocktail hour)</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Ceremony & cocktail hour furniture plus setup</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Seasonal hors d&apos;oeuvres by Local Effort</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Curated beverage package plus professional bar staff</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Seasonal florals (installation, bouquet, boutonniere)</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Licensed officiant services</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Photography coverage (ceremony, cocktails, portraits)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Link href="/calendar?package=fast">
                      <Button className="w-full md-state-layer md-state-layer-primary bg-tertiary-container text-tertiary-container-foreground hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-4)] ease-emphasized" size="lg">
                        <Calendar className="w-5 h-5 mr-2" />
                        Check Availability
                      </Button>
                    </Link>
                    <p className="text-body-small text-on-surface-variant text-center">
                      Perfect for up to 35 guests
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Build Your Own */}
              <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-3 transition-shadow duration-[var(--md-sys-motion-duration-medium-2)] ease-emphasized">
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-patrick-hand-sc)] text-2xl text-on-surface">Build Your Own</CardTitle>
                  <CardDescription className="text-sm text-on-surface-variant">
                    Customize every detail your way
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-display-medium font-expressive text-primary mb-2">Custom</div>
                    <p className="text-body-medium text-on-surface-variant">$1,000 deposit - variable balance</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-title-medium font-baseline font-semibold text-on-surface">What You Get:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Select your preferred vendors</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Choose specific services you need</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Interactive dashboard with real-time pricing</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Direct messaging with vendors</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Add or remove services anytime</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Autosave so you never lose progress</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Admin visibility for support</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                        <span className="text-body-medium text-on-surface leading-5">Flexible guest count</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Link href="/calendar?package=custom">
                      <Button variant="outline" className="w-full md-state-layer md-state-layer-primary border-2 border-primary text-primary hover:bg-primary-container/20 transition-colors duration-[var(--md-sys-motion-duration-short-4)] ease-emphasized" size="lg">
                        <Calendar className="w-5 h-5 mr-2" />
                        Check Availability
                      </Button>
                    </Link>
                    <p className="text-body-small text-on-surface-variant text-center">
                      Perfect for up to 85 guests
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 md:mt-12 text-center">
              <Link href="/">
                <Button variant="ghost" className="text-on-surface hover:bg-surface-container-high">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
