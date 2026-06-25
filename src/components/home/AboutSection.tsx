'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'

const STATS = [
  { stat: '31',   label: 'Courts' },
  { stat: '8',    label: 'Districts' },
  { stat: '2',    label: 'Runs / Weekend' },
  { stat: '2025', label: 'Est.' },
]

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* ── Left: text ─────────────────────────────────────────────────── */}
          <div className="reveal-up">
            <p className="font-mono text-orange text-xs uppercase tracking-[0.2em] mb-5">
              About Splinters
            </p>

            <h2
              className="font-display text-navy leading-none mb-7"
              style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)' }}
            >
              WE CONNECT PEOPLE TO BASKETBALL{' '}
              <span className="text-orange">COURTS</span>{' '}
              NEAR THEM
            </h2>

            <p className="text-mid text-base leading-relaxed mb-5">
              Splinters Basketball is Nairobi's premier pickup basketball community. We run weekly games every Saturday at 5PM and Sunday at 6PM across verified courts in Kileleshwa, Lavington, and Parklands.
            </p>

            <p className="text-mid text-base leading-relaxed mb-10">
              Whether you're a seasoned player or picking up the ball for the first time, there's a run for you. Join 200+ members who play every weekend, 52 weeks a year.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register"
                className="px-6 py-3.5 rounded bg-orange text-white font-semibold text-center hover:bg-orange-dark transition-colors"
              >
                Register for Free
              </Link>

              <button
                onClick={() => signIn('google', { callbackUrl: '/auth/setup' })}
                className="px-6 py-3.5 rounded border-2 border-gray-200 text-navy font-semibold flex items-center justify-center gap-3 hover:border-gray-400 transition-colors"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>
          </div>

          {/* ── Right: stats ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-5 reveal-up">
            {STATS.map(({ stat, label }) => (
              <div
                key={label}
                className="bg-light-gray rounded-xl p-8 flex flex-col items-center justify-center text-center"
              >
                <p
                  className="font-display text-navy leading-none"
                  style={{ fontSize: 'clamp(3rem,6vw,4.5rem)' }}
                >
                  {stat}
                </p>
                <p className="font-mono text-orange text-xs uppercase tracking-[0.15em] mt-3">
                  {label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
