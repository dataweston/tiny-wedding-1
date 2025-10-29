'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { BeehiveIcon } from '@/components/icons/beehive'

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push(decodeURIComponent(redirect))
      }
    }
    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push(decodeURIComponent(redirect))
      }
    })

    return () => subscription.unsubscribe()
  }, [redirect, router])

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${decodeURIComponent(redirect)}`
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
          <BeehiveIcon className="w-16 h-16 mx-auto mb-6 text-rose-500" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign Up to Continue</h1>
          <p className="text-gray-600">
            Create your account to hold your wedding date and access your dashboard.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <Button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <p className="text-sm text-gray-500 text-center mt-4">
            By signing up, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}