'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { BeehiveIcon } from '@/components/icons/beehive'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

function SignupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [loading, setLoading] = useState(false)

  const handlePostAuth = useCallback(async () => {
    // Check if this is a date holding redirect
    const url = new URL(decodeURIComponent(redirect), window.location.origin)
    const date = url.searchParams.get('date')
    const packageType = url.searchParams.get('package')

    try {
      await fetch('/api/auth/claim', { credentials: 'include' })
    } catch (error) {
      console.error('Failed to sync user profile after authentication:', error)
    }

    if (date && packageType) {
      // This is a date holding request - create the booking
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventDate: date, packageType })
        })
        const data = await res.json()
        if (res.ok && data.dashboardId) {
          // For custom packages, go to questionnaire first to gather details
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
      }
    }

    // Default redirect
    router.push(decodeURIComponent(redirect))
  }, [redirect, router])

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
    router.push(`/signup/email?redirect=${encodeURIComponent(redirect)}`)
  }

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signup?redirect=${encodeURIComponent(redirect)}`
        }
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
            <a href="/login" className="text-rose-600 hover:underline">
              Sign in
            </a>
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
