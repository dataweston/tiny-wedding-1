import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BeehiveIcon } from '@/components/icons/beehive'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SparklesCore } from '@/components/ui/sparkles'
import { MotionInit } from '@/components/motion-init'
import { Group, Camera, Flower, OrganicFood, GlassHalf, Spark, Check } from 'iconoir-react'
import heroImage from '@/lib/resource/IMG_8412.jpg'
import simplePackageImage from '@/lib/resource/IMG_8422.jpg'
import customPackageImage from '@/lib/resource/2S6A8682.jpg'

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <MotionInit />
      {/* Hero Section - M3 Expressive */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-primary-container/10 to-surface py-8 px-4 sm:px-6 lg:px-8">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={80}
          className="absolute inset-0 w-full h-full"
          particleColor="#f97316"
          speed={0.6}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <BeehiveIcon className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h1 className="text-display-large font-expressive text-foreground mb-6">
            Tiny Weddings
          </h1>
          <p className="text-title-large font-expressive text-on-surface mb-4 max-w-3xl mx-auto">
            Intimate, Beautiful, Unforgettable
          </p>
          <p className="text-body-large text-on-surface/80 mb-8 max-w-2xl mx-auto">
            Providing small, elegant, and tasteful wedding ceremonies in Minneapolis, MN. Build your own vendor package.
          </p>
          <Link href="/packages">
            <Button size="lg" className="md-state-layer md-state-layer-primary bg-primary-container text-primary-container-foreground hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-4)] ease-emphasized text-title-medium px-8 py-6">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Image - M3 XL Shape */}
      <section className="px-4 sm:px-6 lg:px-8 bg-surface py-8">
        <div className="max-w-5xl mx-auto overflow-hidden rounded-[28px] shadow-elevation-2">
          <div className="relative aspect-[4/3] sm:aspect-[16/9]">
            <Image
              src={heroImage}
              alt="Couple celebrating their Tiny Wedding"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services Section - M3 Surface Containers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-headline-large font-expressive text-foreground text-center mb-4">What We Offer</h2>
          <p className="text-body-large text-on-surface/80 text-center mb-12 max-w-2xl mx-auto">
            Everything you need for your perfect intimate wedding
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-scroll-reveal>
            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <Spark className="w-10 h-10 mb-2 text-tertiary/70 group-hover:text-tertiary transition-colors duration-200" />
                <CardTitle className="text-title-large font-baseline">Event Design</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Professional coordination by Alyssa Andes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <Group className="w-10 h-10 mb-2 text-secondary/70 group-hover:text-secondary transition-colors duration-200" />
                <CardTitle className="text-title-large font-baseline">Perfect Little Venues</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Proud to work with Tiny Diner in Minneapolis</CardDescription>
              </CardHeader>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <OrganicFood className="w-10 h-10 mb-2 text-tertiary/70 group-hover:text-tertiary transition-colors duration-200" />
                <CardTitle className="text-title-large font-baseline">Catering</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Seasonal hors d&apos;oeuvres by Local Effort</CardDescription>
              </CardHeader>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <GlassHalf className="w-10 h-10 mb-2 text-secondary/70 group-hover:text-secondary transition-colors duration-200" />
                <CardTitle className="text-title-large font-baseline">Bar Service</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Curated drinks & pro bartender</CardDescription>
              </CardHeader>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <Flower className="w-10 h-10 mb-2 text-tertiary/70 group-hover:text-tertiary transition-colors duration-200" />
                <CardTitle className="text-title-large font-baseline">Florals</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Seasonal ceremony design & bouquet</CardDescription>
              </CardHeader>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <BeehiveIcon className="w-10 h-10 mb-2 text-primary" />
                <CardTitle className="text-title-large font-baseline">Officiant</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Licensed officiant services</CardDescription>
              </CardHeader>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <Camera className="w-10 h-10 mb-2 text-secondary/70 group-hover:text-secondary transition-colors duration-200" />
                <CardTitle className="text-title-large font-baseline">Photography</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Ceremony & portraits included</CardDescription>
              </CardHeader>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-3)] ease-emphasized group">
              <CardHeader>
                <Check className="w-10 h-10 mb-2 text-tertiary/70 group-hover:text-tertiary transition-colors duration-200" />
                <CardTitle className="text-title-large font-baseline">All-Inclusive</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">No hidden fees or surprises</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* ...removed Meet Soup Sisters section... */}

      {/* Pricing Preview - M3 Surface Container Ladder */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-headline-large font-expressive text-foreground text-center mb-4">Our Packages</h2>
          <p className="text-body-large text-on-surface/80 text-center mb-12">
            Choose the perfect fit for your celebration
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" data-scroll-reveal>
            <Card className="md-state-layer md-state-layer-tertiary bg-surface-container-high border-2 border-tertiary hover:shadow-elevation-3 transition-shadow duration-[var(--md-sys-motion-duration-medium-2)] ease-emphasized">
              <CardHeader>
                <div className="relative mb-4 overflow-hidden rounded-[16px]">
                  <Image
                    src={simplePackageImage}
                    alt="Simple Package ceremony setup"
                    width={800}
                    height={600}
                    className="object-cover w-full h-52"
                  />
                </div>
                <CardTitle className="text-title-large font-expressive text-on-surface">Simple Package</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">All-inclusive, pre-designed perfection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-display-medium font-expressive text-tertiary mb-4">$5,000</div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Event coordination & design</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Exclusive venue use</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Catering & bar service</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Florals & photography</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-tertiary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Officiant services</span>
                  </li>
                </ul>
                <Link href="/packages">
                  <Button className="w-full md-state-layer md-state-layer-primary bg-tertiary-container text-tertiary-container-foreground hover:shadow-elevation-2 transition-shadow duration-[var(--md-sys-motion-duration-short-4)] ease-emphasized" size="lg">
                    Keep It Simple
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="md-state-layer md-state-layer-surface bg-surface-container hover:shadow-elevation-3 transition-shadow duration-[var(--md-sys-motion-duration-medium-2)] ease-emphasized">
              <CardHeader>
                <div className="relative mb-4 overflow-hidden rounded-[16px]">
                  <Image
                    src={customPackageImage}
                    alt="Custom Tiny Wedding reception"
                    width={800}
                    height={600}
                    className="object-cover w-full h-52"
                  />
                </div>
                <CardTitle className="text-title-large font-expressive text-on-surface">Build Your Own</CardTitle>
                <CardDescription className="text-body-medium text-on-surface-variant">Customize every detail your way</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-display-medium font-expressive text-primary mb-4">Custom</div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Choose your services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Select preferred vendors</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Real-time pricing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Interactive dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-body-medium text-on-surface">Direct vendor messaging</span>
                  </li>
                </ul>
                <Link href="/packages">
                  <Button variant="outline" className="w-full md-state-layer md-state-layer-primary border-2 border-primary text-primary hover:bg-primary-container/20 transition-colors duration-[var(--md-sys-motion-duration-short-4)] ease-emphasized" size="lg">
                    Build Your Package
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ...removed Ready to Start Planning section... */}

      {/* Footer links section remains, copyright footer removed. */}
    </main>
  )
}

