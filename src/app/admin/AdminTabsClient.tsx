'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Users, CreditCard, BarChart2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MembersTab } from '@/components/admin/MembersTab'
import { PaymentsTab } from '@/components/admin/PaymentsTab'
import { PollsTab } from '@/components/admin/PollsTab'
import { SOCMonitor } from '@/components/admin/SOCMonitor'
import type { User, Payment, Poll, SOCEvent, LoginAttempt, HoneypotHit } from '@/types'

interface Props {
  members: User[]
  payments: Payment[]
  polls: Poll[]
  events: SOCEvent[]
  loginAttempts: LoginAttempt[]
  honeypotHits: HoneypotHit[]
}

type Tab = 'members' | 'payments' | 'polls' | 'soc'

export function AdminTabsClient({ members, payments, polls, events, loginAttempts, honeypotHits }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('members')

  const refresh = useCallback(() => router.refresh(), [router])

  const tabs = [
    { id: 'members' as const, label: 'Members', icon: Users, count: members.length },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard, count: payments.filter(p => p.status === 'pending').length },
    { id: 'polls' as const, label: 'Polls', icon: BarChart2, count: polls.length },
    { id: 'soc' as const, label: 'SOC', icon: Shield, count: events.filter(e => e.anomaly_score >= 7).length },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === id ? 'bg-white text-navy shadow-sm' : 'text-mid hover:text-navy'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {count > 0 && (
              <span className={cn(
                'text-xs font-mono px-1.5 py-0.5 rounded',
                activeTab === id
                  ? id === 'soc' && count > 0 ? 'bg-red-100 text-red-700' : 'bg-navy/10 text-navy'
                  : 'bg-gray-200 text-mid'
              )}>{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'members' && <MembersTab members={members} onRefresh={refresh} />}
      {activeTab === 'payments' && <PaymentsTab payments={payments} onRefresh={refresh} />}
      {activeTab === 'polls' && <PollsTab polls={polls} onRefresh={refresh} />}
      {activeTab === 'soc' && (
        <SOCMonitor
          events={events}
          loginAttempts={loginAttempts}
          honeypotHits={honeypotHits}
          onRefresh={refresh}
        />
      )}
    </div>
  )
}
