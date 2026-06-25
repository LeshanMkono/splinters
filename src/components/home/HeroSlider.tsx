'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    image: '/images/hero-1.jpg',
    label: 'Olive Crescent · Kileleshwa · Saturday 5PM',
  },
  {
    image: '/images/hero-2.jpg',
    label: 'NIS Lavington · Parklands Sports Club · Sunday 6PM',
  },
  {
    image: '/images/hero-3.jpg',
    label: 'Splinters Basketball · Nairobi · Every Weekend',
  },
]

const AUTOPLAY_MS = 8000

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [labelVisible, setLabelVisible] = useState(true)
  const touchStartX = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = useCallback((index: number) => {
    setLabelVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setLabelVisible(true)
    }, 300)
  }, [])

  const next = useCallback(() => go((current + 1) % SLIDES.length), [current, go])
  const prev = useCallback(() => go((current - 1 + SLIDES.length) % SLIDES.length), [current, go])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, AUTOPLAY_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, paused, next])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
  }

  return (
    <section>
      {/* ── Image zone ─────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-navy"
        style={{ height: 'clamp(260px, 42vw, 800px)' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={cn('hero-slide', i === current && 'active')}
            style={{
              backgroundImage: `url('${slide.image}')`,
              backgroundColor: '#1B2B6B',
            }}
            aria-hidden={i !== current}
          />
        ))}

        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current
                  ? 'w-6 h-2 bg-orange'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Navy content zone ──────────────────────────────────────────────── */}
      <div className="bg-navy px-6 sm:px-10 md:px-16 lg:px-24 py-12 md:py-16">
        <div className="max-w-3xl">
          {/* Slide label — fades out/in on change */}
          <p
            className={cn(
              'font-mono text-orange text-xs uppercase tracking-[0.2em] mb-4 transition-opacity duration-300',
              labelVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            {SLIDES[current].label}
          </p>

          <h1 className="font-display text-white leading-none mb-6"
            style={{ fontSize: 'clamp(3rem,9vw,7rem)' }}>
            FIND YOUR{' '}
            <span className="text-orange">COURT.</span>
          </h1>

          <p className="text-white/70 font-sans text-base md:text-lg leading-relaxed mb-8 max-w-xl">
            31 verified basketball courts across Nairobi. Saturday 5PM at Olive Crescent, Sunday 6PM at Parklands — every weekend, rain or shine.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/auth/register"
              className="px-7 py-3.5 rounded bg-orange text-white font-semibold hover:bg-orange-dark transition-colors"
            >
              Join Free →
            </Link>
            <Link
              href="/auth/login"
              className="px-7 py-3.5 rounded border-2 border-white/70 text-white font-semibold hover:bg-white hover:text-navy transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
