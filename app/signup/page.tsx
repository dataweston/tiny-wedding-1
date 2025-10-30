'use client'

import { useEffect, useState, Suspense, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { BeehiveIcon } from '@/components/icons/beehive'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { buildAbsoluteAppUrl, withAppBasePath } from '@/lib/url'

function SignupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const date = searchParams.get('date')
  const packageType = searchParams.get('package')
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const hasHandledAuth = useRef(false)

  const handlePostAuth = useCallback(async () => {
    // Prevent double-execution
    if (hasHandledAuth.current) {
      return
    }
    hasHandledAuth.current = true

    try {
      // Sync user with database
      await fetch('/api/auth/claim', { credentials: 'include' })
    } catch (error) {
      console.error('Failed to sync user profile after authentication:', error)
      setError('Failed to sync user profile. Please refresh the page.')
      return
    }

    // If we have date and package, this is a booking flow
    if (date && packageType) {
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventDate: date, packageType })
        })
        const data = await res.json()

        if (!res.ok) {
          console.error('Booking creation failed:', data.error)
          setError(data.error || 'Failed to create booking')
          return
        }

        if (data.dashboardId) {
          // For custom packages, go to questionnaire first
          // For fast packages, go straight to dashboard
          if (packageType === 'custom') {
            router.push(`/questionnaire?booking=${data.bookingId}`)
          } else {
            router.push(`/dashboard?id=${data.dashboardId}`)
          }
          return
        }
      } catch (error) {
        console.error('Error creating booking after signup:', error)
        setError('Failed to create booking. Please try again.')
        return
      }
    }

    // No booking needed, just redirect to intended destination
    router.push(redirect)
  }, [date, packageType, redirect, router])

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await handlePostAuth()
      }
    }
    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        await handlePostAuth()
      }
    })

    return () => subscription.unsubscribe()
  }, [handlePostAuth])

  const handleEmailSignup = () => {
    // Build the redirect URL with all necessary params
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    if (packageType) params.set('package', packageType)
    if (redirect !== '/dashboard') params.set('redirect', redirect)
    const redirectUrl = params.toString() ? `/signup/email?${params.toString()}` : '/signup/email'
    router.push(redirectUrl)
  }

  const handleSignIn = async () => {
    setLoading(true)
    try {
      // Build the OAuth redirect URL preserving date and package params
      const params = new URLSearchParams()
      if (date) params.set('date', date)
      if (packageType) params.set('package', packageType)
      if (redirect !== '/dashboard') params.set('redirect', redirect)
      const redirectUrl = params.toString() ? `/signup?${params.toString()}` : '/signup'

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: buildAbsoluteAppUrl(redirectUrl),
        },
      })
    } catch (error) {
      console.error('Sign in error', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <BeehiveIcon className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign Up to Continue</h1>
          <p className="text-gray-600">
            Create your account to hold your wedding date and access your dashboard.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleEmailSignup}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Sign Up with Email
          </Button>

          <Button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="text-center text-sm text-gray-600 pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-rose-600">
              Sign in
            </Link>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            By signing up, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}
