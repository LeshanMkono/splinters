import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { PollCard } from '@/components/poll/PollCard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: { weekId: string }
}

export default async function PollPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const supabase = createServerClient()
  const userId = session.user.id

  const [userRes, pollRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('polls').select('*').eq('week_id', params.weekId).single(),
  ])

  if (!userRes.data) redirect('/auth/login')
  if (!pollRes.data) notFound()

  const poll = pollRes.data
  const user = userRes.data

  // Check exclusive access
  if (poll.requires_exclusive && user.membership_status !== 'active') {
    return (
      <>
        <DashboardNav user={user} />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-xl border border-orange/30 p-8 text-center">
            <p className="font-display text-2xl text-navy mb-2">EXCLUSIVE MEMBERS ONLY</p>
            <p className="text-mid text-sm mb-6">This game is restricted to active members.</p>
            <Link href="/auth/payment" className="inline-flex px-6 py-3 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark transition-colors">
              Activate Membership
            </Link>
          </div>
        </main>
      </>
    )
  }

  const { data: counts } = await supabase.rpc('get_poll_vote_counts', { p_poll_id: poll.id })
  const { data: myVoteRow } = await supabase
    .from('votes')
    .select('choice')
    .eq('poll_id', poll.id)
    .eq('user_id', userId)
    .maybeSingle()

  // Fetch yes-voters with nicknames for avatar row
  const { data: yesVoters } = await supabase
    .from('votes')
    .select('user:users(id, nickname, full_name, avatar_url)')
    .eq('poll_id', poll.id)
    .eq('choice', 'yes')
    .limit(12)

  const pollWithVotes = {
    ...poll,
    vote_counts: counts?.[0] ?? { yes: 0, no: 0, maybe: 0 },
    user_vote: myVoteRow?.choice ?? null,
    yes_voters: yesVoters?.map((v: any) => v.user).filter(Boolean) ?? [],
  }

  return (
    <>
      <DashboardNav user={user} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-mid hover:text-navy text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <PollCard
          poll={poll}
          initialVotes={(yesVoters?.map((v: any) => v.user).filter(Boolean) ?? []) as any[]}
          initialUserVote={(myVoteRow?.choice ?? null) as import('@/types').VoteChoice | null}
          userId={userId}
          isLoggedIn={true}
        />
      </main>
    </>
  )
}
