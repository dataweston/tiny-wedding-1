"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  open: boolean
  onClose: () => void
  eventDate: string
  packageType: 'fast' | 'custom'
  onSuccess?: (dashboardId: string) => void
}

export function HoldModal({ open, onClose, eventDate, packageType, onSuccess }: Props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return alert('Please enter email')

    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventDate, packageType, clientEmail: email, clientName: name })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to hold date')
        return
      }
      onClose()
      if (onSuccess && data.dashboardId) onSuccess(data.dashboardId)
    } catch (err) {
      console.error(err)
      alert('Failed to hold date')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle>Hold Date for 12 hours</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Full name (optional)</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Holding...' : 'Hold Date'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
