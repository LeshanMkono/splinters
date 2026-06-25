'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Search, ChevronDown, ChevronUp, CheckCircle, XCircle, Ban, MessageSquare } from 'lucide-react'
import { MembershipBadge, RoleBadge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { User, MembershipStatus } from '@/types'

interface MembersTabProps {
  members: User[]
  onRefresh: () => void
}

type StatusFilter = 'all' | MembershipStatus

export function MembersTab({ members, onRefresh }: MembersTabProps) {
  const { success, error: showError } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = members.filter(m => {
    const matchSearch =
      !search ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.nickname || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.full_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || m.membership_status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleAction(
    userId: string,
    action: 'confirm' | 'reject' | 'suspend' | 'approve_whatsapp',
    extra?: Record<string, unknown>
  ) {
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/members/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action, ...extra }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Action failed')
        success('Done')
        onRefresh()
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid" />
          <input
            type="text"
            placeholder="Search by name, email, nickname…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-orange/50"
        >
          <option value="all">All ({members.length})</option>
          <option value="active">Active</option>
          <option value="pending_payment">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Member</th>
                <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Nickname</th>
                <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Joined</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-mid text-sm">
                    No members found
                  </td>
                </tr>
              )}
              {filtered.map(member => (
                <>
                  <tr
                    key={member.id}
                    className={cn(
                      'border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer',
                      expandedId === member.id && 'bg-gray-50/50'
                    )}
                    onClick={() => setExpandedId(v => v === member.id ? null : member.id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {member.avatar_url ? (
                          <Image src={member.avatar_url} alt="" width={32} height={32} className="rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center">
                            {(member.full_name || member.email)[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-navy">{member.full_name || '—'}</p>
                          <p className="text-xs text-mid">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-mid">{member.nickname || '—'}</td>
                    <td className="px-5 py-3.5"><MembershipBadge status={member.membership_status} /></td>
                    <td className="px-5 py-3.5"><RoleBadge role={member.role} /></td>
                    <td className="px-5 py-3.5 text-mid">{formatDate(member.created_at)}</td>
                    <td className="px-5 py-3.5 text-mid">
                      {expandedId === member.id
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                      }
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expandedId === member.id && (
                    <tr key={`${member.id}-expanded`} className="border-b border-gray-100 bg-gray-50/30">
                      <td colSpan={6} className="px-5 py-4">
                        <div className="flex flex-wrap gap-3">
                          {member.membership_status === 'pending_payment' && (
                            <button
                              onClick={() => handleAction(member.id, 'confirm')}
                              disabled={isPending}
                              className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" /> Activate
                            </button>
                          )}
                          {member.whatsapp_requested && !member.whatsapp_approved && (
                            <button
                              onClick={() => handleAction(member.id, 'approve_whatsapp')}
                              disabled={isPending}
                              className="flex items-center gap-2 px-4 py-2 rounded bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20b558] disabled:opacity-50 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" /> Approve WhatsApp
                            </button>
                          )}
                          {member.membership_status !== 'suspended' && member.role !== 'admin' && (
                            <button
                              onClick={() => handleAction(member.id, 'suspend')}
                              disabled={isPending}
                              className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              <Ban className="w-4 h-4" /> Suspend
                            </button>
                          )}
                          {member.membership_status === 'suspended' && (
                            <button
                              onClick={() => handleAction(member.id, 'confirm')}
                              disabled={isPending}
                              className="flex items-center gap-2 px-4 py-2 rounded bg-orange text-white text-sm font-semibold hover:bg-orange-dark disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" /> Reinstate
                            </button>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-mid">
                              Phone: {member.phone_number || '—'} ·
                              WA: {member.whatsapp_requested ? (member.whatsapp_approved ? '✅ Approved' : '⏳ Requested') : '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-mid font-mono">Showing {filtered.length} of {members.length} members</p>
    </div>
  )
}
