'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Courts',    href: '/courts' },
  { label: 'Schedule',  href: '/#schedule' },
  { label: 'Community', href: '/#community' },
  { label: 'About',     href: '/#about' },
]

export function PublicNav() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-200',
          scrolled && 'border-b border-gray-100 shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <Image
                src="/Splintersbasketball.png"
                alt="Splinters Basketball"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-display text-2xl text-navy tracking-wide leading-none">
                Splinters
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="relative font-sans text-sm font-medium text-mid hover:text-navy transition-colors group"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-navy hover:text-orange transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.nickname || 'avatar'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">
                      {(session.user.nickname || session.user.name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span>{session.user.nickname || session.user.name || 'Dashboard'}</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded border-2 border-navy text-navy text-sm font-semibold hover:bg-navy hover:text-white transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 rounded bg-orange text-white text-sm font-semibold hover:bg-orange-dark transition-colors duration-200"
                  >
                    Join Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-navy rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar — slides in from right */}
      <aside
        className={cn(
          'mobile-nav fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl md:hidden flex flex-col',
          menuOpen && 'open'
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="font-display text-2xl text-navy tracking-wide">Splinters</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-navy rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-6 py-8 flex flex-col gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-2xl text-navy tracking-wide hover:text-orange transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-8 flex flex-col gap-3">
          {session ? (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-center w-full px-4 py-3 rounded bg-orange text-white font-semibold"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="text-center w-full px-4 py-3 rounded border-2 border-navy text-navy font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="text-center w-full px-4 py-3 rounded bg-orange text-white font-semibold"
              >
                Join Free
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
