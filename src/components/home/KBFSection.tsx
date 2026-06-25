import { ExternalLink } from 'lucide-react'

const KBF_CARDS = [
  {
    title: 'KBF Leagues',
    body: 'National men\'s and women\'s divisions. Splinters players actively compete at league level.',
  },
  {
    title: 'Jr. NBA Programme',
    body: 'KBF runs Kenya\'s official Jr. NBA programme, developing youth talent across Nairobi.',
  },
  {
    title: 'NBA Africa 100 Courts',
    body: 'Part of the NBA\'s Africa 100 courts initiative — bringing world-class basketball infrastructure to Kenya.',
  },
  {
    title: '3x3 Basketball',
    body: 'FIBA 3x3 events run by KBF throughout the year. Several Splinters alumni have competed nationally.',
  },
]

export function KBFSection() {
  return (
    <section id="community" className="py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 bg-light-gray">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">

          {/* ── Left: text ─────────────────────────────────────────────────── */}
          <div>
            <p className="font-mono text-orange text-xs uppercase tracking-[0.2em] mb-5">
              The Bigger Picture
            </p>

            <h2
              className="font-display text-navy leading-none mb-7"
              style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)' }}
            >
              PART OF KENYA'S BASKETBALL COMMUNITY
            </h2>

            <p className="text-mid text-base leading-relaxed mb-5">
              Splinters is proud to be part of the Kenya Basketball Federation (KBF) community — the governing body for basketball in Kenya, affiliated with FIBA.
            </p>

            <p className="text-mid text-base leading-relaxed mb-8">
              KBF organizes national leagues, the Jr. NBA programme, and works alongside NBA Africa on the 100 courts initiative — building the game from the ground up across the country.
            </p>

            <a
              href="https://kenyabasketballfederation.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange font-semibold hover:underline"
            >
              kenyabasketballfederation.org
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* ── Right: cards ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {KBF_CARDS.map(({ title, body }) => (
              <div
                key={title}
                className="bg-white rounded-lg p-5 border-l-4 border-navy hover:border-orange transition-colors"
              >
                <h3 className="font-display text-navy text-xl mb-2">{title}</h3>
                <p className="text-mid text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
