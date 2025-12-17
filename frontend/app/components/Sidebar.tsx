'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, History } from 'lucide-react'

const menuItems = [
  { href: '/menu', label: 'Menu', icon: Home },
  { href: '/tracking', label: 'Tracking', icon: MapPin },
  { href: '/history', label: 'History', icon: History },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Smart Parking</h1>
        <p className="text-gray-400 text-sm">Admin Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

