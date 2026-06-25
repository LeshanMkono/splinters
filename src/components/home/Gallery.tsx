// Server component — no interactivity needed

const COURTS = [
  {
    image: '/images/court-1.jpg',
    name: 'Olive Crescent',
    district: 'Kileleshwa',
    bgColor: '#1B2B6B',
  },
  {
    image: '/images/court-2.jpg',
    name: 'NIS Lavington',
    district: 'Lavington',
    bgColor: '#243580',
  },
  {
    image: '/images/court-3.jpg',
    name: 'Parklands Sports Club',
    district: 'Parklands',
    bgColor: '#131f50',
  },
]

export function Gallery() {
  return (
    <section id="courts-gallery" className="py-16 md:py-20 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-orange text-xs uppercase tracking-[0.2em] mb-3">
            Where We Play
          </p>
          <h2 className="font-display text-navy" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
            THREE FEATURED COURTS
          </h2>
        </div>

        {/* Desktop: 3 portrait columns | Mobile: single 16/9 column */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: '3px' }}
        >
          {COURTS.map(({ image, name, district, bgColor }) => (
            <div
              key={name}
              className="gallery-card relative overflow-hidden cursor-pointer"
              style={{
                /* portrait on desktop, landscape on mobile */
                aspectRatio: 'var(--gallery-ratio, 3/4)',
              }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundImage: `url('${image}')`,
                  backgroundColor: bgColor,
                }}
              />

              {/* Hover overlay */}
              <div className="overlay absolute inset-0 flex flex-col justify-end p-6">
                <p className="font-mono text-orange text-xs uppercase tracking-widest mb-1">
                  {district}
                </p>
                <p className="font-display text-white text-2xl leading-tight">
                  {name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile gallery ratio override */}
        <style>{`
          @media (max-width: 767px) {
            #courts-gallery .gallery-card { --gallery-ratio: 16/9; }
          }
        `}</style>
      </div>
    </section>
  )
}
