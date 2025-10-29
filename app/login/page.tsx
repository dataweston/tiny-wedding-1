'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { buildAbsoluteAppUrl } from '@/lib/url'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const packageType = searchParams.get('package')
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState('')
  const hasHandledAuth = useRef(false)

  useEffect(() => {
    let isMounted = true

    const syncAndRedirect = async () => {
      // Prevent double-execution
      if (hasHandledAuth.current) {
        return
      }

      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!isMounted || !user) {
        return
      }

      hasHandledAuth.current = true

      try {
        await fetch('/api/auth/claim', { credentials: 'include' })
      } catch (claimError) {
        console.error('Failed to sync user session on login:', claimError)
        setError('Failed to sync user session')
        return
      }

      // If we have date and package, create booking
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
            if (packageType === 'custom') {
              router.push(`/questionnaire?booking=${data.bookingId}`)
            } else {
              router.push(`/dashboard?id=${data.dashboardId}`)
            }
            return
          }
        } catch (error) {
          console.error('Error creating booking after login:', error)
          setError('Failed to create booking')
          return
        }
      }

      router.push(redirect)
      router.refresh()
    }

    syncAndRedirect()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        // Prevent double-execution
        if (hasHandledAuth.current) {
          return
        }
        hasHandledAuth.current = true

        try {
          await fetch('/api/auth/claim', { credentials: 'include' })
        } catch (claimError) {
          console.error('Failed to sync user session after OAuth login:', claimError)
          setError('Failed to sync user session')
          return
        }

        // If we have date and package, create booking
        if (date && packageType) {
          try {
            const res = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ eventDate: date, packageType })
            })
            const bookingData = await res.json()

            if (!res.ok) {
              console.error('Booking creation failed:', bookingData.error)
              setError(bookingData.error || 'Failed to create booking')
              return
            }

            if (bookingData.dashboardId) {
              if (packageType === 'custom') {
                router.push(`/questionnaire?booking=${bookingData.bookingId}`)
              } else {
                router.push(`/dashboard?id=${bookingData.dashboardId}`)
              }
              return
            }
          } catch (error) {
            console.error('Error creating booking after OAuth login:', error)
            setError('Failed to create booking')
            return
          }
        }

        router.push(redirect)
        router.refresh()
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [date, packageType, redirect, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Claim user in database
      await fetch('/api/auth/claim', { credentials: 'include' })

      // If we have date and package, create booking
      if (date && packageType) {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventDate: date, packageType })
        })
        const bookingData = await res.json()

        if (!res.ok) {
          throw new Error(bookingData.error || 'Failed to create booking')
        }

        if (bookingData.dashboardId) {
          if (packageType === 'custom') {
            router.push(`/questionnaire?booking=${bookingData.bookingId}`)
          } else {
            router.push(`/dashboard?id=${bookingData.dashboardId}`)
          }
          return
        }
      }

      router.push(redirect)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setOauthLoading(true)
    setError('')

    try {
      // Build the OAuth redirect URL preserving date and package params
      const params = new URLSearchParams()
      if (date) params.set('date', date)
      if (packageType) params.set('package', packageType)
      if (redirect !== '/dashboard') params.set('redirect', redirect)
      const redirectUrl = params.toString() ? `/login?${params.toString()}` : '/login'

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: buildAbsoluteAppUrl(redirectUrl),
        },
      })
    } catch (err: any) {
      console.error('Google sign-in failed:', err)
      setError(err.message || 'Failed to sign in with Google')
      setOauthLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Tiny Weddings account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || oauthLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || oauthLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || oauthLoading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-xs uppercase tracking-wide text-gray-400">or</div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading || oauthLoading}
            >
              {oauthLoading ? 'Redirecting...' : 'Continue with Google'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-rose-600 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
        <div>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
