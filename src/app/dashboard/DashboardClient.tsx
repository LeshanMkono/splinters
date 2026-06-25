'use client'

import { useState, useCallback } from 'react'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { PaymentStatus } from '@/components/dashboard/PaymentStatus'
import { PlayCalendar } from '@/components/dashboard/PlayCalendar'
import type { User, Poll, Payment, PollWithVotes } from '@/types'

interface DashboardClientProps {
  user: User
  polls: PollWithVotes[]
  payments: Payment[]
  playedDates: string[]
}

export function DashboardClient({ user, polls, payments, playedDates }: DashboardClientProps) {
  const [activePolls, setActivePolls] = useState(polls.filter(p => p.is_active))

  const latestPayment = payments[0] ?? null
  const pendingPayments = payments.filter(p => p.status === 'pending')
  const confirmedPayments = payments.filter(p => p.status === 'confirmed')

  const stats = [
    { label: 'Games Voted', value: playedDates.length },
    { label: 'Payments Made', value: confirmedPayments.length },
    { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }) },
  ]

  return (
    <>
      <DashboardNav user={user} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <p className="text-xs font-mono text-mid uppercase tracking-widest mb-1">Member Dashboard</p>
          <h1 className="font-display text-4xl sm:text-5xl text-navy leading-tight">
            WELCOME BACK{user.nickname ? `, ${user.nickname.toUpperCase()}` : ''}
          </h1>
        </div>

        <StatsRow stats={stats} />

        <PaymentStatus
          membershipStatus={user.membership_status}
          latestPayment={latestPayment}
          payments={payments}
        />

        {/* Active polls */}
        {activePolls.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-navy mb-4">UPCOMING GAMES</h2>
            <div className="space-y-4">
              {activePolls.map(poll => (
                <a
                  key={poll.id}
                  href={`/poll/${poll.week_id}`}
                  className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-orange/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">{poll.title}</p>
                      <p className="text-sm text-mid mt-0.5">{poll.venue} · {poll.game_time}</p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                      Vote Now →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <PlayCalendar playedDates={playedDates} />
      </main>
    </>
  )
}
