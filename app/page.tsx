import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Users, Camera, Flower2, UtensilsCrossed, Wine, Sparkles, Check } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-rose-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-rose-500" />
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Tiny Weddings
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Intimate, Beautiful, Unforgettable
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            All-inclusive wedding packages at Tiny Diner for celebrations that matter most
          </p>
          <Link href="/packages">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
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
                <Sparkles className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Event Design</CardTitle>
                <CardDescription>Professional coordination by Soup Sisters</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Exclusive Venue</CardTitle>
                <CardDescription>Private use of Tiny Diner space</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <UtensilsCrossed className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Catering</CardTitle>
                <CardDescription>Seasonal hors d'oeuvres by Local Effort</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Wine className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Bar Service</CardTitle>
                <CardDescription>Curated drinks & pro bartender</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Flower2 className="w-10 h-10 mb-2 text-rose-500" />
                <CardTitle>Florals</CardTitle>
                <CardDescription>Seasonal ceremony design & bouquet</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Heart className="w-10 h-10 mb-2 text-rose-500" />
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

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-rose-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Meet Soup Sisters</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Your dedicated event coordinators and design team
          </p>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-6">
              Soup Sisters brings years of event planning expertise and creative design to every Tiny Wedding. 
              We handle all the details so you can focus on what matters—celebrating your love with the people who mean the most.
            </p>
            <p className="text-lg text-gray-700">
              From the first consultation to your last dance, we&apos;re with you every step of the way, 
              ensuring your intimate celebration is exactly as you&apos;ve dreamed.
            </p>
          </div>
        </div>
      </section>

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
                <CardTitle className="text-2xl">Fast Package</CardTitle>
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
                    Choose Fast Package
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50 to-rose-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Book your date today with just a $1,000 deposit
          </p>
          <Link href="/packages">
            <Button size="lg" className="text-lg px-12 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Heart className="w-8 h-8 mx-auto mb-4 text-rose-400" />
          <p className="text-gray-400">© 2025 Tiny Weddings. All rights reserved.</p>
          <p className="text-gray-500 mt-2">Intimate celebrations at Tiny Diner</p>
        </div>
      </footer>
    </main>
  )
}
