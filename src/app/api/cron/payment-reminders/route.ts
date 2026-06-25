import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendPaymentReminderEmail } from '@/lib/emails'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Find active members with no payment this month
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const { data: members } = await supabase
    .from('users')
    .select('id, email, full_name, nickname')
    .eq('membership_status', 'active')

  if (!members) return NextResponse.json({ sent: 0 })

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

  return NextResponse.json({ success: true, sent })
}
