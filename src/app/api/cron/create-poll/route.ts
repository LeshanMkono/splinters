import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getWeekId, getCurrentWeekIds } from '@/lib/utils'
import { sendPollLiveEmail } from '@/lib/emails'

export async function GET(req: NextRequest) {
  // Verify cron secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { sat: satId, sun: sunId } = getCurrentWeekIds()

  const pollsToCreate = [
    {
      week_id: satId,
      title: `Saturday Pickup — Olive Crescent`,
      day: 'saturday' as const,
      venue: 'Olive Crescent International School',
      venue_address: 'Kileleshwa, Nairobi',
      game_time: '5:00 PM',
      poll_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requires_exclusive: true,
    },
    {
      week_id: sunId,
      title: `Sunday Pickup — NIS Lavington`,
      day: 'sunday' as const,
      venue: 'Nairobi International School',
      venue_address: 'Lavington, Nairobi',
      game_time: '6:00 PM',
      poll_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requires_exclusive: true,
    },
  ]

  const created = []
  for (const p of pollsToCreate) {
    const { data: existing } = await supabase.from('polls').select('id').eq('week_id', p.week_id).maybeSingle()
    if (existing) continue

    const { data: poll } = await supabase.from('polls').insert({ ...p, is_active: true }).select().single()
    if (poll) {
      created.push(poll)

      const { data: members } = await supabase
        .from('users')
        .select('email, full_name, nickname')
        .eq('membership_status', 'active')

      if (members) {
        await Promise.allSettled(
          members.map(m =>
            sendPollLiveEmail(m.email, m.nickname ?? m.full_name ?? 'Member', p.week_id, p.week_id, p.venue, p.venue, p.game_time, p.game_time)
          )
        )
      }
    }
  }

  return NextResponse.json({ success: true, created: created.length })
}
