import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { sendPaymentConfirmedEmail } from '@/lib/emails'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { paymentId, notes } = await req.json()
  if (!paymentId) return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 })

  const supabase = createServiceClient()

  const { data: payment, error: pErr } = await supabase
    .from('payments')
    .update({ status: 'confirmed', admin_notes: notes ?? null, confirmed_at: new Date().toISOString() })
    .eq('id', paymentId)
    .select('*, user:users(id, email, full_name, nickname)')
    .single()

  if (pErr || !payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  // Activate member
  await supabase
    .from('users')
    .update({ membership_status: 'active' })
    .eq('id', payment.user_id)

  await sendPaymentConfirmedEmail(
    payment.user?.email ?? '',
    payment.user?.full_name ?? 'Member',
    payment.mpesa_reference ?? '',
    payment.month
  ).catch(() => null)

  return NextResponse.json({ success: true })
}
