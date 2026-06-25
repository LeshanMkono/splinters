import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Find active members who haven't paid this month or last
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`

  const { data: members } = await supabase
    .from('users')
    .select('id, email')
    .eq('membership_status', 'active')

  if (!members) return NextResponse.json({ expired: 0 })

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

  return NextResponse.json({ success: true, expired })
}
