'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

function EmailSignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const packageType = searchParams.get('package')
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      // Claim user in database
      await fetch('/api/auth/claim', { credentials: 'include' })

      // If we have date and package, create booking
      if (date && packageType) {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventDate: date, packageType })
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to create booking')
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
      }

      // No booking needed, just redirect
      router.push(redirect)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up for your Tiny Weddings account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane & John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
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
                minLength={6}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">At least 6 characters</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-rose-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EmailSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
        <div>Loading...</div>
      </div>
    }>
      <EmailSignupForm />
    </Suspense>
  )
}
