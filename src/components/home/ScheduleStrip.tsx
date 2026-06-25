import { Clock, MapPin } from 'lucide-react'

const SCHEDULE = [
  {
    day: 'SATURDAY',
    time: '5:00 PM',
    venue: 'Olive Crescent International School',
    location: 'Kileleshwa, Nairobi',
    tag: 'Every Saturday',
  },
  {
    day: 'SUNDAY',
    time: '6:00 PM',
    venue: 'Parklands Sports Club / NIS Lavington',
    location: 'Rotating weekly',
    tag: 'Every Sunday',
  },
]

export function ScheduleStrip() {
  return (
    <section id="schedule" className="bg-navy py-16 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <p className="font-mono text-orange text-xs uppercase tracking-[0.2em]">
            Weekend Schedule
          </p>
          <p className="font-sans text-white/50 text-sm">
            52 weekends · Rain or shine
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {SCHEDULE.map(({ day, time, venue, location, tag }) => (
            <div
              key={day}
              className="border border-white/10 rounded-xl p-7 hover:border-orange/40 transition-colors group"
            >
              {/* Day eyebrow */}
              <p className="font-mono text-orange/70 text-xs uppercase tracking-[0.2em] mb-4 group-hover:text-orange transition-colors">
                {tag}
              </p>

              {/* Day + time */}
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-display text-white text-5xl leading-none">
                  {day}
                </span>
              </div>

              {/* Time row */}
              <div className="flex items-center gap-2 text-white/80 mb-3">
                <Clock className="w-4 h-4 text-orange flex-shrink-0" />
                <span className="font-sans font-semibold text-lg">{time}</span>
              </div>

              {/* Venue row */}
              <div className="flex items-start gap-2 text-white/60">
                <MapPin className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm text-white/80">{venue}</p>
                  <p className="font-sans text-xs text-white/50 mt-0.5">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
