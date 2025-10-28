import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span className="text-xl font-bold">Tiny Weddings</span>
            </div>
            <p className="text-gray-400 text-sm">
              Intimate celebrations at Tiny Diner by the Soup Sisters
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/packages" className="hover:text-white transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-white transition-colors">
                  Check Availability
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Packages */}
          <div>
            <h3 className="font-semibold mb-4">Our Packages</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Fast Package - $5,000</li>
              <li>Build Your Own</li>
              <li>$1,000 deposit to secure date</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Tiny Diner</li>
              <li>Minneapolis, MN</li>
              <li>contact@tinyweddings.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tiny Weddings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
