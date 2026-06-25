import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { sendPollLiveEmail } from '@/lib/emails'
import { z } from 'zod'

const schema = z.object({
  weekId: z.string().min(3).max(30),
  title: z.string().min(3).max(120),
  day: z.enum(['saturday', 'sunday']),
  venue: z.string().min(2).max(120),
  venueAddress: z.string().max(200).optional().default(''),
  gameTime: z.string().min(2).max(30),
  pollDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  requiresExclusive: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { weekId, title, day, venue, venueAddress, gameTime, pollDate, requiresExclusive } = parsed.data
  const supabase = createServiceClient()

  const { data: existing } = await supabase.from('polls').select('id').eq('week_id', weekId).maybeSingle()
  if (existing) return NextResponse.json({ error: 'A poll with this Week ID already exists.' }, { status: 409 })

  const { data: poll, error } = await supabase
    .from('polls')
    .insert({ week_id: weekId, title, day, venue, venue_address: venueAddress, game_time: gameTime, poll_date: pollDate, requires_exclusive: requiresExclusive, is_active: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create poll.' }, { status: 500 })

  // Notify all active members
  const { data: members } = await supabase
    .from('users')
    .select('email, full_name, nickname')
    .eq('membership_status', 'active')

  if (members) {
    await Promise.allSettled(
      members.map(m =>
        sendPollLiveEmail(m.email, m.nickname ?? m.full_name ?? 'Member', weekId, weekId, venue, venue, gameTime, gameTime)
      )
    )
  }

  return NextResponse.json({ success: true, poll })
}
