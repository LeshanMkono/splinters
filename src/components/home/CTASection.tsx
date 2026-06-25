import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
      <div className="max-w-4xl mx-auto text-center">

        <p className="font-mono text-orange text-xs uppercase tracking-[0.2em] mb-6">
          Ready to play?
        </p>

        <h2
          className="font-display text-navy leading-none mb-10"
          style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}
        >
          LOG IN AND FIND A{' '}
          <span className="text-orange">PICKUP GAME.</span>
        </h2>

        <p className="text-mid text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12">
          Vote on this weekend's games, see who's showing up, and get directions to the nearest court — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-4 rounded bg-orange text-white font-semibold text-lg hover:bg-orange-dark transition-colors"
          >
            Log In →
          </Link>
          <Link
            href="/auth/register"
            className="px-8 py-4 rounded border-2 border-navy text-navy font-semibold text-lg hover:bg-navy hover:text-white transition-all"
          >
            Create Account
          </Link>
        </div>

      </div>
    </section>
  )
}
