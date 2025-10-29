import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BeehiveIcon } from '@/components/icons/beehive'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SparklesCore } from '@/components/ui/sparkles'
import { Group, Camera, Flower, OrganicFood, GlassHalf, Spark, Check } from 'iconoir-react'
import heroImage from '@/lib/resource/IMG_8412.jpg'
import simplePackageImage from '@/lib/resource/IMG_8422.jpg'
import customPackageImage from '@/lib/resource/2S6A8682.jpg'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-amber-50 to-white py-24 px-4 sm:px-6 lg:px-8">
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
          <BeehiveIcon className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Tiny Weddings
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Intimate, Beautiful, Unforgettable
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            All-inclusive wedding packages at Tiny Diner for celebrations that matter most
          </p>
          <Link href="/packages">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Image */}
      <section className="px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-lg">
          <div className="relative aspect-[16/9]">
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

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">What We Offer</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need for your perfect intimate wedding
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Spark className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Event Design</CardTitle>
                <CardDescription>Professional coordination by Alyssa Andes</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Group className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Perfect Little Venues</CardTitle>
                <CardDescription>Proud to work with Tiny Diner in Minneapolis</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <OrganicFood className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Catering</CardTitle>
                <CardDescription>Seasonal hors d&apos;oeuvres by Local Effort</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <GlassHalf className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Bar Service</CardTitle>
                <CardDescription>Curated drinks & pro bartender</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Flower className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Florals</CardTitle>
                <CardDescription>Seasonal ceremony design & bouquet</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <BeehiveIcon className="w-10 h-10 mb-2" />
                <CardTitle>Officiant</CardTitle>
                <CardDescription>Licensed officiant services</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Camera className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Photography</CardTitle>
                <CardDescription>Ceremony & portraits included</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Check className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>All-Inclusive</CardTitle>
                <CardDescription>No hidden fees or surprises</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* ...removed Meet Soup Sisters section... */}

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our Packages</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Choose the perfect fit for your celebration
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-rose-500">
              <CardHeader>
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={simplePackageImage}
                    alt="Simple Package ceremony setup"
                    width={800}
                    height={600}
                    className="object-cover w-full h-52"
                  />
                </div>
                <CardTitle className="text-2xl">Simple Package</CardTitle>
                <CardDescription>All-inclusive, pre-designed perfection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">$5,000</div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Event coordination & design</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Exclusive venue use</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Catering & bar service</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Florals & photography</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Officiant services</span>
                  </li>
                </ul>
                <Link href="/packages">
                  <Button className="w-full" size="lg">
                    Keep It Simple
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={customPackageImage}
                    alt="Custom Tiny Wedding reception"
                    width={800}
                    height={600}
                    className="object-cover w-full h-52"
                  />
                </div>
                <CardTitle className="text-2xl">Build Your Own</CardTitle>
                <CardDescription>Customize every detail your way</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">Custom</div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Choose your services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Select preferred vendors</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Real-time pricing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Interactive dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 mr-2 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>Direct vendor messaging</span>
                  </li>
                </ul>
                <Link href="/packages">
                  <Button variant="outline" className="w-full" size="lg">
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

