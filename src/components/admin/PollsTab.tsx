'use client'

import { useState, useTransition } from 'react'
import { Plus, ToggleLeft, ToggleRight, Calendar } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Poll } from '@/types'

interface PollsTabProps {
  polls: Poll[]
  onRefresh: () => void
}

interface CreatePollForm {
  weekId: string
  title: string
  day: 'saturday' | 'sunday'
  venue: string
  venueAddress: string
  gameTime: string
  pollDate: string
  requiresExclusive: boolean
}

const EMPTY_FORM: CreatePollForm = {
  weekId: '',
  title: '',
  day: 'saturday',
  venue: '',
  venueAddress: '',
  gameTime: '',
  pollDate: '',
  requiresExclusive: false,
}

export function PollsTab({ polls, onRefresh }: PollsTabProps) {
  const { success, error: showError } = useToast()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreatePollForm>(EMPTY_FORM)
  const [isPending, startTransition] = useTransition()

  function field(key: keyof CreatePollForm) {
    return {
      value: String(form[key]),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/polls/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to create poll')
        success('Poll created!')
        setForm(EMPTY_FORM)
        setShowCreate(false)
        onRefresh()
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Error creating poll')
      }
    })
  }

  async function togglePoll(pollId: string, isActive: boolean) {
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/polls/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pollId, isActive: !isActive }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed')
        success(isActive ? 'Poll closed' : 'Poll opened')
        onRefresh()
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange'

  return (
    <div className="space-y-5">
      {/* Create button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-mid font-mono">{polls.length} polls total</p>
        <button
          onClick={() => setShowCreate(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded bg-orange text-white text-sm font-semibold hover:bg-orange-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Poll
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-navy mb-5">Create Poll</h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Week ID *</label>
              <input placeholder="e.g. 2025-W24-SAT" required {...field('weekId')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Title *</label>
              <input placeholder="e.g. Saturday Pickup — Olive Crescent" required {...field('title')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Day *</label>
              <select required {...field('day')} className={inputClass}>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Game Time *</label>
              <input placeholder="e.g. 5:00 PM" required {...field('gameTime')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Venue *</label>
              <input placeholder="e.g. Olive Crescent International School" required {...field('venue')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Venue Address</label>
              <input placeholder="e.g. Kileleshwa, Nairobi" {...field('venueAddress')} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Poll Date *</label>
              <input type="date" required {...field('pollDate')} className={inputClass} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="requiresExclusive"
                checked={form.requiresExclusive}
                onChange={e => setForm(f => ({ ...f, requiresExclusive: e.target.checked }))}
                className="w-4 h-4 accent-orange"
              />
              <label htmlFor="requiresExclusive" className="text-sm text-navy">Exclusive members only</label>
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded bg-orange text-white font-semibold text-sm hover:bg-orange-dark disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Creating…' : 'Create Poll'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreate(false); setForm(EMPTY_FORM) }}
                className="px-5 py-2.5 rounded border border-gray-200 text-mid text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Polls list */}
      <div className="space-y-3">
        {polls.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-mid text-sm">
            No polls yet. Create one above.
          </div>
        )}
        {polls.map(poll => (
          <div
            key={poll.id}
            className={cn(
              'bg-white rounded-xl border p-5 flex items-center gap-4',
              poll.is_active ? 'border-green-200' : 'border-gray-100 opacity-70'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy text-sm truncate">{poll.title}</p>
              <p className="text-xs text-mid mt-0.5">
                {poll.week_id} · {poll.game_time} · {poll.venue}
              </p>
              <p className="text-xs text-mid">{formatDate(poll.poll_date)}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={cn('font-mono text-xs uppercase', poll.is_active ? 'text-green-600' : 'text-mid')}>
                {poll.is_active ? 'Active' : 'Closed'}
              </span>
              <button
                onClick={() => togglePoll(poll.id, poll.is_active)}
                disabled={isPending}
                className="text-mid hover:text-navy disabled:opacity-50 transition-colors"
                aria-label={poll.is_active ? 'Close poll' : 'Open poll'}
              >
                {poll.is_active
                  ? <ToggleRight className="w-6 h-6 text-green-600" />
                  : <ToggleLeft className="w-6 h-6" />
                }
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
