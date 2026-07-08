import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentWeekIds } from '@/lib/utils'
import { sendPollLiveEmail, sendPaymentReminderEmail } from '@/lib/emails'

// ─────────────────────────────────────────────────────────────────────────────
// CONSOLIDATED DAILY CRON
// Single Vercel cron trigger dispatches to the jobs below based on the current
// date/weekday in Africa/Nairobi time (the app's local timezone).
// ─────────────────────────────────────────────────────────────────────────────

function getNairobiParts(now: Date): { weekday: string; dayOfMonth: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Nairobi',
    weekday: 'long',
    day: 'numeric',
  }).formatToParts(now)

  const weekday = parts.find(p => p.type === 'weekday')?.value ?? ''
  const dayOfMonth = Number(parts.find(p => p.type === 'day')?.value)

  return { weekday, dayOfMonth }
}

async function createSaturdayPolls(): Promise<number> {
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

  let created = 0
  for (const p of pollsToCreate) {
    const { data: existing } = await supabase.from('polls').select('id').eq('week_id', p.week_id).maybeSingle()
    if (existing) continue

    const { data: poll } = await supabase.from('polls').insert({ ...p, is_active: true }).select().single()
    if (poll) {
      created++

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

  return created
}

async function sendPaymentReminders(): Promise<number> {
  const supabase = createServiceClient()
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const { data: members } = await supabase
    .from('users')
    .select('id, email, full_name, nickname')
    .eq('membership_status', 'active')

  if (!members) return 0

  let sent = 0
  for (const member of members) {
    const { data: payment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', member.id)
      .eq('month', currentMonth)
      .maybeSingle()

    if (!payment) {
      const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()
      await sendPaymentReminderEmail(
        member.email,
        member.nickname ?? member.full_name ?? 'Member',
        daysLeft
      ).catch(() => null)
      sent++
    }
  }

  return sent
}

async function checkMembershipExpiry(): Promise<number> {
  const supabase = createServiceClient()
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`

  const { data: members } = await supabase
    .from('users')
    .select('id, email')
    .eq('membership_status', 'active')

  if (!members) return 0

  let expired = 0
  for (const member of members) {
    const { data: recentPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', member.id)
      .eq('status', 'confirmed')
      .in('month', [currentMonth, prevMonth])
      .maybeSingle()

    if (!recentPayment) {
      await supabase.from('users').update({ membership_status: 'pending_payment' }).eq('id', member.id)
      expired++
    }
  }

  return expired
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { weekday, dayOfMonth } = getNairobiParts(new Date())
  const result: { pollsCreated?: number; remindersSent?: number; expired: number } = { expired: 0 }

  if (weekday === 'Saturday') {
    result.pollsCreated = await createSaturdayPolls()
  }

  if (dayOfMonth === 28) {
    result.remindersSent = await sendPaymentReminders()
  }

  result.expired = await checkMembershipExpiry()

  return NextResponse.json({ success: true, weekday, dayOfMonth, ...result })
}
