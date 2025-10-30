import Link from 'next/link'
import { BeehiveIcon } from '@/components/icons/beehive'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BeehiveIcon className="w-6 h-6" />
              <span className="text-xl font-bold">Tiny Weddings</span>
            </div>
            <p className="text-gray-400 text-sm">
              coordinating beautiful, modern, small weddings in Minneapolis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/packages">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/calendar">
                  Check Availability
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Alyssa Andes</li>
              <li>soupsistersmn@gmail.com</li>
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
