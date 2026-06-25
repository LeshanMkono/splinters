'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { MapPin, Clock, Share2, Check, Users } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { VoteOption } from './VoteOption'
import { useToast } from '@/components/ui/Toast'
import type { Poll, Vote, VoteChoice, VoteCounts } from '@/types'

interface PollCardProps {
  poll: Poll
  initialVotes: Vote[]
  initialUserVote: VoteChoice | null
  userId?: string
  isLoggedIn: boolean
}

function calcCounts(votes: Vote[]): VoteCounts {
  const counts = { yes: 0, no: 0, maybe: 0, total: votes.length }
  for (const v of votes) {
    if (v.choice === 'yes') counts.yes++
    else if (v.choice === 'no') counts.no++
    else if (v.choice === 'maybe') counts.maybe++
  }
  return counts
}

export function PollCard({ poll, initialVotes, initialUserVote, userId, isLoggedIn }: PollCardProps) {
  const { success, error: showError, info } = useToast()
  const [votes, setVotes] = useState<Vote[]>(initialVotes)
  const [userVote, setUserVote] = useState<VoteChoice | null>(initialUserVote)
  const [voting, setVoting] = useState(false)
  const [copied, setCopied] = useState(false)

  const counts = calcCounts(votes)

  // ── Supabase Realtime subscription ─────────────────────────────────────────
  useEffect(() => {
    const supabase = createBrowserClient()
    const channel = supabase
      .channel(`poll-votes-${poll.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `poll_id=eq.${poll.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVotes(prev => [...prev, payload.new as Vote])
          } else if (payload.eventType === 'UPDATE') {
            setVotes(prev => prev.map(v => v.id === payload.new.id ? payload.new as Vote : v))
          } else if (payload.eventType === 'DELETE') {
            setVotes(prev => prev.filter(v => v.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [poll.id])

  // ── Vote handler ────────────────────────────────────────────────────────────
  const handleVote = useCallback(async (choice: VoteChoice) => {
    if (!isLoggedIn) {
      info('Sign in to vote')
      return
    }
    if (voting) return
    setVoting(true)

    // Optimistic update
    const previousVotes = votes
    const previousUserVote = userVote

    setUserVote(choice)
    setVotes(prev => {
      const withoutMine = prev.filter(v => v.user_id !== userId)
      return [...withoutMine, { id: 'optimistic', user_id: userId!, poll_id: poll.id, choice, voted_at: new Date().toISOString() }]
    })

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: poll.id, choice }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to vote')
      }
      const data = await res.json()
      // Replace optimistic with real vote
      setVotes(prev => [
        ...prev.filter(v => v.id !== 'optimistic'),
        data.data as Vote,
      ])
      success(`Voted ${choice === 'yes' ? 'In ✅' : choice === 'no' ? 'Out ❌' : 'Maybe ❓'}`)
    } catch (err) {
      // Rollback
      setVotes(previousVotes)
      setUserVote(previousUserVote)
      showError(err instanceof Error ? err.message : 'Could not save vote')
    } finally {
      setVoting(false)
    }
  }, [isLoggedIn, voting, votes, userVote, userId, poll.id, success, showError, info])

  // ── Share ───────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = `${window.location.origin}/poll/${poll.week_id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showError('Could not copy link')
    }
  }

  // ── Yes voters avatar row ───────────────────────────────────────────────────
  const yesVoters = votes.filter(v => v.choice === 'yes' && v.user)
  const visibleYes = yesVoters.slice(0, 8)
  const overflowCount = yesVoters.length - 8

  const dayLabel = poll.day === 'saturday' ? 'SAT' : 'SUN'
  const dayColor = poll.day === 'saturday' ? 'text-orange' : 'text-blue-400'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-navy px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`font-mono text-xs uppercase tracking-[0.2em] font-bold ${dayColor}`}>
                {dayLabel}
              </span>
              {!poll.is_active && (
                <span className="font-mono text-xs text-white/40 uppercase">Closed</span>
              )}
            </div>
            <h3 className="font-display text-white text-2xl leading-tight">{poll.title}</h3>
          </div>
          <button
            onClick={handleShare}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Share poll"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <Clock className="w-3.5 h-3.5 text-orange" />
            <span>{poll.game_time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/70 text-sm">
            <MapPin className="w-3.5 h-3.5 text-orange" />
            <span>{poll.venue}</span>
          </div>
        </div>
      </div>

      {/* Vote options */}
      <div className="px-6 py-5 flex flex-col gap-3">
        {(['yes', 'maybe', 'no'] as VoteChoice[]).map(choice => (
          <VoteOption
            key={choice}
            choice={choice}
            count={counts[choice]}
            total={counts.total}
            selected={userVote === choice}
            disabled={voting || !isLoggedIn || !poll.is_active}
            onVote={handleVote}
          />
        ))}

        {!isLoggedIn && (
          <p className="text-center text-sm text-mid pt-1">
            <a href="/auth/login" className="text-orange font-semibold hover:underline">Sign in</a>
            {' '}to cast your vote
          </p>
        )}
      </div>

      {/* Footer: total + yes-voter avatars */}
      <div className="px-6 pb-5 border-t border-gray-50 pt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-mid text-sm">
          <Users className="w-4 h-4" />
          <span><strong className="text-navy">{counts.total}</strong> {counts.total === 1 ? 'vote' : 'votes'}</span>
        </div>

        {yesVoters.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-mid mr-1">In:</span>
            <div className="flex -space-x-2">
              {visibleYes.map((v, i) => (
                <div
                  key={v.id}
                  className="w-7 h-7 rounded-full border-2 border-white bg-navy text-white flex items-center justify-center text-xs font-bold overflow-hidden"
                  title={v.user?.nickname || 'Player'}
                  style={{ zIndex: 8 - i }}
                >
                  {v.user?.avatar_url ? (
                    <Image src={v.user.avatar_url} alt={v.user.nickname || ''} width={28} height={28} className="object-cover" />
                  ) : (
                    (v.user?.nickname || 'P')[0].toUpperCase()
                  )}
                </div>
              ))}
              {overflowCount > 0 && (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                  +{overflowCount}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
