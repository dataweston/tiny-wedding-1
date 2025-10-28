'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { BeehiveIcon } from '@/components/icons/beehive'
import { useState } from 'react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BeehiveIcon className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold">Tiny Weddings</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/packages" className="text-gray-700 hover:text-rose-500 transition-colors">
              Packages
            </Link>
            <Link href="/calendar" className="text-gray-700 hover:text-rose-500 transition-colors">
              Availability
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-rose-500 transition-colors">
              Admin
            </Link>
            <Button asChild>
              <Link href="/packages">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
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
            <Link
              href="/admin"
              className="block text-gray-700 hover:text-rose-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <Button asChild className="w-full">
              <Link href="/packages" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
