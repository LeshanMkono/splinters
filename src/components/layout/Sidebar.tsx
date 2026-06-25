'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Map, CalendarDays, Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface SidebarProps {
  role: UserRole
  isOpen?: boolean
  onClose?: () => void
}

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/courts',    label: 'Courts Map', icon: Map },
]

const adminLinks = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
]

export function Sidebar({ role, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const content = (
    <nav className="flex flex-col gap-1 p-4">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            pathname === href
              ? 'bg-orange/10 text-orange'
              : 'text-mid hover:bg-gray-100 hover:text-navy'
          )}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
        </Link>
      ))}

      {role === 'admin' && (
        <>
          <div className="my-2 border-t border-gray-100" />
          {adminLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-orange/10 text-orange'
                  : 'text-orange/80 hover:bg-orange/5 hover:text-orange'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </>
      )}
    </nav>
  )

  // Mobile: full-screen overlay drawer
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'mobile-nav fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 lg:hidden',
          isOpen && 'open'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-xs font-mono font-semibold text-mid uppercase tracking-wider">Navigation</span>
          <button onClick={onClose} className="text-mid hover:text-navy">
            <X className="w-5 h-5" />
          </button>
        </div>
        {content}
      </aside>
    </>
  )
}
