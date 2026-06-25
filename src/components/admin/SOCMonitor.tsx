'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, Lock, Eye, RefreshCw } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { SOCEvent, LoginAttempt, HoneypotHit } from '@/types'

interface SOCMonitorProps {
  events: SOCEvent[]
  loginAttempts: LoginAttempt[]
  honeypotHits: HoneypotHit[]
  onRefresh: () => void
}

type EventFilter = 'all' | 'brute_force' | 'honeypot' | 'rate_limit' | 'auth' | 'anomaly'
type ActiveTab = 'events' | 'logins' | 'honeypots'

const EVENT_COLORS: Record<string, string> = {
  brute_force:        'text-red-600   bg-red-50   border-red-100',
  honeypot:           'text-yellow-700 bg-yellow-50 border-yellow-100',
  rate_limit:         'text-orange     bg-orange/5  border-orange/20',
  login_success:      'text-green-600  bg-green-50  border-green-100',
  login_failure:      'text-red-600    bg-red-50    border-red-100',
  suspicious_request: 'text-purple-600 bg-purple-50 border-purple-100',
}

function getEventColor(type: string): string {
  return EVENT_COLORS[type] || 'text-mid bg-gray-50 border-gray-100'
}

function AnomalyBadge({ score }: { score: number }) {
  const color =
    score >= 7 ? 'bg-red-500' :
    score >= 4 ? 'bg-orange' :
    score >= 1 ? 'bg-yellow-400' :
    'bg-gray-200'
  return (
    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', color)}>
      {score}
    </div>
  )
}

export function SOCMonitor({ events, loginAttempts, honeypotHits, onRefresh }: SOCMonitorProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('events')
  const [eventFilter, setEventFilter] = useState<EventFilter>('all')
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    onRefresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const filteredEvents = events.filter(e => {
    if (eventFilter === 'all') return true
    if (eventFilter === 'anomaly') return e.anomaly_score >= 5
    return e.event_type.includes(eventFilter)
  })

  const tabs = [
    { id: 'events' as const,   label: 'Events',         icon: Eye,           count: events.length },
    { id: 'logins' as const,   label: 'Login Attempts', icon: Lock,          count: loginAttempts.length },
    { id: 'honeypots' as const, label: 'Honeypots',     icon: AlertTriangle, count: honeypotHits.length },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-orange" />
          <h3 className="font-display text-navy text-xl">SOC Monitor</h3>
          {events.some(e => e.anomaly_score >= 7) && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
              <AlertTriangle className="w-3 h-3" /> High severity events
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-sm text-mid hover:text-navy transition-colors"
        >
          <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === id
                ? 'bg-white text-navy shadow-sm'
                : 'text-mid hover:text-navy'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={cn(
              'text-xs font-mono px-1.5 py-0.5 rounded',
              activeTab === id ? 'bg-navy/10 text-navy' : 'bg-gray-200 text-mid'
            )}>{count}</span>
          </button>
        ))}
      </div>

      {/* Events tab */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'brute_force', 'honeypot', 'rate_limit', 'auth', 'anomaly'] as EventFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setEventFilter(f)}
                className={cn(
                  'px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wide transition-colors',
                  eventFilter === f
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-mid hover:bg-gray-200'
                )}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {filteredEvents.length === 0 ? (
              <div className="p-10 text-center text-mid text-sm">No events match the filter</div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
                {filteredEvents.slice(0, 100).map(event => (
                  <div key={event.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/50">
                    <AnomalyBadge score={event.anomaly_score} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('px-2 py-0.5 rounded border text-xs font-mono font-semibold', getEventColor(event.event_type))}>
                          {event.event_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-mid font-mono">{event.path || '—'}</span>
                        <span className="text-xs text-mid">{event.method} {event.status_code}</span>
                      </div>
                      {Object.keys(event.metadata).length > 0 && (
                        <p className="text-xs text-mid mt-1 font-mono truncate">
                          {JSON.stringify(event.metadata)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-mid flex-shrink-0 font-mono">{formatDateTime(event.occurred_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login attempts tab */}
      {activeTab === 'logins' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">IP Hash</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Email Targeted</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Attempts</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Locked Until</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">First Seen</th>
                </tr>
              </thead>
              <tbody>
                {loginAttempts.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-mid text-sm">No login attempts recorded</td></tr>
                )}
                {loginAttempts.map(attempt => (
                  <tr key={attempt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-mid">{attempt.ip_hash.slice(0, 16)}…</td>
                    <td className="px-5 py-3.5 text-mid text-xs">{attempt.email_tried || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('font-bold text-sm', attempt.attempt_count >= 10 ? 'text-red-600' : attempt.attempt_count >= 5 ? 'text-orange' : 'text-navy')}>
                        {attempt.attempt_count}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-mid font-mono">
                      {attempt.locked_until
                        ? <span className="text-red-600">{formatDateTime(attempt.locked_until)}</span>
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-mid">{formatDateTime(attempt.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Honeypot hits tab */}
      {activeTab === 'honeypots' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">IP Hash</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Path Hit</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">User Agent</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody>
                {honeypotHits.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-mid text-sm">No honeypot hits recorded</td></tr>
                )}
                {honeypotHits.map(hit => (
                  <tr key={hit.id} className="border-b border-gray-50 hover:bg-yellow-50/30">
                    <td className="px-5 py-3.5 font-mono text-xs text-mid">{hit.ip_hash.slice(0, 16)}…</td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">{hit.path_hit}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-mid truncate max-w-[200px]">{hit.user_agent || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-mid font-mono">{formatDateTime(hit.hit_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
