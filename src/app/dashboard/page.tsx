import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'
import type { Poll, Payment, PollWithVotes } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const supabase = createServerClient()
  const userId = session.user.id

  const [userRes, pollsRes, paymentsRes, votesRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('polls').select('*').order('poll_date', { ascending: false }).limit(10),
    supabase.from('payments').select('*, user:users(id, email, nickname, full_name)').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('votes').select('poll_id, choice, created_at').eq('user_id', userId),
  ])

  if (!userRes.data) redirect('/auth/login')

  const user = userRes.data
  const polls: Poll[] = pollsRes.data ?? []
  const payments: Payment[] = paymentsRes.data ?? []
  const votes = votesRes.data ?? []

  // Fetch vote counts for all polls
  const pollsWithVotes: PollWithVotes[] = await Promise.all(
    polls.map(async poll => {
      const { data: counts } = await supabase.rpc('get_poll_vote_counts', { p_poll_id: poll.id })
      const myVote = votes.find(v => v.poll_id === poll.id)
      const rawCounts = counts?.[0] ?? { yes: 0, no: 0, maybe: 0 }
      return {
        ...poll,
        votes: [],
        voteCounts: { yes: rawCounts.yes, no: rawCounts.no, maybe: rawCounts.maybe, total: (rawCounts.yes ?? 0) + (rawCounts.no ?? 0) + (rawCounts.maybe ?? 0) },
        userVote: (myVote?.choice ?? null) as import('@/types').VoteChoice | null,
      }
    })
  )

  // Dates where user voted yes
  const playedDates = votes
    .filter(v => v.choice === 'yes')
    .map(v => {
      const poll = polls.find(p => p.id === v.poll_id)
      return poll?.poll_date ?? null
    })
    .filter(Boolean) as string[]

  return (
    <DashboardClient
      user={user}
      polls={pollsWithVotes}
      payments={payments}
      playedDates={playedDates}
    />
  )
}
