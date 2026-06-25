import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/security'

const schema = z.object({
  pollId: z.string().uuid(),
  choice: z.enum(['yes', 'no', 'maybe']),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!checkRateLimit(`vote:${session.user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many votes. Slow down.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { pollId, choice } = parsed.data
  const supabase = createServiceClient()

  // Check poll exists and is active
  const { data: poll } = await supabase
    .from('polls')
    .select('id, is_active, requires_exclusive')
    .eq('id', pollId)
    .single()

  if (!poll) return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  if (!poll.is_active) return NextResponse.json({ error: 'Poll is closed' }, { status: 400 })

  // Check exclusive access
  if (poll.requires_exclusive) {
    const { data: user } = await supabase
      .from('users')
      .select('membership_status')
      .eq('id', session.user.id)
      .single()
    if (user?.membership_status !== 'active') {
      return NextResponse.json({ error: 'Active membership required' }, { status: 403 })
    }
  }

  // Upsert vote
  const { error } = await supabase.from('votes').upsert(
    { poll_id: pollId, user_id: session.user.id, choice },
    { onConflict: 'poll_id,user_id' }
  )

  if (error) return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })

  // Return updated counts
  const { data: counts } = await supabase.rpc('get_poll_vote_counts', { p_poll_id: pollId })
  return NextResponse.json({ success: true, counts: counts?.[0] ?? { yes: 0, no: 0, maybe: 0 } })
}
