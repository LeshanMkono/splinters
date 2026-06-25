'use client'

import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, getDay, addMonths, subMonths, isToday,
  parseISO, isValid,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlayCalendarProps {
  /** ISO date strings (YYYY-MM-DD) where the user voted 'yes' */
  playedDates: string[]
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function PlayCalendar({ playedDates }: PlayCalendarProps) {
  const [viewMonth, setViewMonth] = useState(new Date())

  const parsedPlayed = playedDates
    .map(d => parseISO(d))
    .filter(isValid)

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Padding days at the start (0=Sun, 6=Sat)
  const startPadding = getDay(monthStart)

  const isPlayed = (d: Date) => parsedPlayed.some(p => isSameDay(p, d))
  const isWeekendDay = (d: Date) => {
    const dow = getDay(d)
    return dow === 0 || dow === 6
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-navy text-xl">
          {format(viewMonth, 'MMMM yyyy').toUpperCase()}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMonth(m => subMonths(m, 1))}
            className="w-8 h-8 rounded flex items-center justify-center text-mid hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMonth(new Date())}
            className="px-2 py-1 rounded text-xs font-mono text-mid hover:bg-gray-100 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setViewMonth(m => addMonths(m, 1))}
            className="w-8 h-8 rounded flex items-center justify-center text-mid hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="cal-grid mb-1">
        {WEEKDAY_LABELS.map(d => (
          <div
            key={d}
            className={cn(
              'text-center font-mono text-xs uppercase tracking-wide py-1.5',
              d === 'Sat' || d === 'Sun' ? 'text-orange/70' : 'text-mid'
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="cal-grid">
        {/* Empty padding cells */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {/* Actual days */}
        {days.map(day => {
          const played = isPlayed(day)
          const today = isToday(day)
          const weekend = isWeekendDay(day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'aspect-square flex items-center justify-center rounded text-sm font-sans transition-colors',
                today && 'ring-2 ring-navy ring-offset-1',
                played && 'bg-orange text-white font-semibold',
                !played && weekend && 'text-orange/80 bg-orange/5',
                !played && !weekend && !today && 'text-mid hover:bg-gray-50',
                !played && today && 'bg-navy/5 text-navy font-semibold'
              )}
              title={played ? `Played on ${format(day, 'MMM d')}` : undefined}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange" />
          <span className="text-xs text-mid font-mono">Played</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-navy" />
          <span className="text-xs text-mid font-mono">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange/10" />
          <span className="text-xs text-mid font-mono">Weekend</span>
        </div>
      </div>
    </div>
  )
}
