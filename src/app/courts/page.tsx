import { auth } from '@/lib/auth'
import { CourtsMapClient } from './CourtsMapClient'
import { PublicNav } from '@/components/layout/PublicNav'
import { Footer } from '@/components/layout/Footer'
import { COURTS } from '@/lib/courts-data'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function CourtsPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <>
      <PublicNav />
      <main className="min-h-screen">
        {isLoggedIn ? (
          <CourtsMapClient courts={COURTS} />
        ) : (
          <AnonymousCourtsView />
        )}
      </main>
      <Footer />
    </>
  )
}

function AnonymousCourtsView() {
  return (
    <div className="relative">
      {/* Blurred map placeholder */}
      <div className="relative h-[70vh] bg-gray-200 overflow-hidden">
        <Image
          src="/images/courts-map-blur.png"
          alt="Courts map — members only"
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
        <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl mb-3 tracking-wide">31 NAIROBI COURTS</h2>
            <p className="text-white/70 text-sm mb-8 max-w-sm mx-auto">
              Sign in to see all courts, get directions, and plan your next game.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/auth/login"
                className="px-6 py-3 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
              >
                Join Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Teaser grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h3 className="font-display text-2xl text-navy mb-6">FEATURED COURTS</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {['Olive Crescent International School', 'Parklands Sports Club', 'NIS Lavington'].map(name => (
            <div key={name} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="w-8 h-8 rounded bg-navy/5 flex items-center justify-center mb-3">
                <Lock className="w-4 h-4 text-navy/40" />
              </div>
              <p className="font-semibold text-navy text-sm">{name}</p>
              <p className="text-xs text-mid mt-1">Details visible to members</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
