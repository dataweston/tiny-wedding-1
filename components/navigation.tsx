'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, Xmark } from 'iconoir-react'
import { BeehiveIcon } from '@/components/icons/beehive'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  animateHoverEnd,
  animateHoverStart,
  animateTap,
} from '@/lib/motion-interactions'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }: { data: { user: any } }) => {
      setUser(data.user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BeehiveIcon className="w-6 h-6" />
            <span className="text-xl font-bold font-logo">Tiny Weddings</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/packages" className="text-gray-700 hover:text-rose-500 transition-colors">
              Packages
            </Link>
            <Link href="/calendar" className="text-gray-700 hover:text-rose-500 transition-colors">
              Availability
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-rose-500 transition-colors">
                  Dashboard
                </Link>
                <Button variant="ghost" onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                  router.refresh()
                }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/packages">Get Started</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            onMouseEnter={(event) => animateHoverStart(event.currentTarget)}
            onMouseLeave={(event) => animateHoverEnd(event.currentTarget)}
            onMouseDown={(event) => animateTap(event.currentTarget)}
          >
            {mobileMenuOpen ? (
              <Xmark className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/packages"
              className="block text-gray-700 hover:text-rose-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Packages
            </Link>
            <Link
              href="/calendar"
              className="block text-gray-700 hover:text-rose-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Availability
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-rose-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    setMobileMenuOpen(false)
                    router.push('/')
                    router.refresh()
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full">
                  <Link href="/packages" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
