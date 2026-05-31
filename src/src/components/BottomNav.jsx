// src/components/BottomNav.jsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Waves,
  Wheat,
  BarChart3,
  User,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/kolam',     icon: Waves,           label: 'Kolam' },
  { href: '/pakan',     icon: Wheat,           label: 'Pakan' },
  { href: '/laporan',   icon: BarChart3,       label: 'Laporan' },
  { href: '/profil',    icon: User,            label: 'Profil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-pb">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors
                ${isActive ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-teal-600' : ''}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
