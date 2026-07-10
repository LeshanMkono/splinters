'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { LogOut, ChevronDown, User as UserIcon, Shield } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Session } from 'next-auth'
import type { User } from '@/types'

export interface DashboardNavProps {
  session?: Session | null
  user?: User | null
}

export function DashboardNav({ session, user: userProp }: DashboardNavProps) {
  const user = userProp ?? session?.user
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (!user) return null
  const displayName = user.nickname || (user as any).name || (user as any).full_name || 'Player'
  const displayImage = (user as any).image || (user as any).avatar_url || null
  const initials = displayName[0].toUpperCase()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-navy border-b border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/Splintersbasketball.png"
              alt="Splinters Basketball"
              width={32}
              height={32}
              className="object-contain brightness-0 invert"
            />
            <span className="font-display text-2xl text-white tracking-wide leading-none">
              Splinters
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/courts" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Courts
            </Link>
            <Link href="/#schedule" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Schedule
            </Link>
            <Link href="/#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              About
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="text-sm font-medium text-orange hover:text-orange-light transition-colors flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2.5 rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={user.nickname || 'avatar'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center text-sm font-bold">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-white hidden sm:block">
                {displayName}
              </span>
              <ChevronDown className={cn('w-4 h-4 text-white/70 transition-transform', dropdownOpen && 'rotate-180')} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-navy truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-mid truncate">{user.email}</p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-mid hover:bg-gray-50 hover:text-navy transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Dashboard
                </Link>

                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange hover:bg-orange/5 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
