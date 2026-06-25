import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { sendPaymentRejectedEmail } from '@/lib/emails'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { paymentId, notes } = await req.json()
  if (!paymentId) return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 })

  const supabase = createServiceClient()

  const { data: payment, error } = await supabase
    .from('payments')
    .update({ status: 'rejected', admin_notes: notes ?? null })
    .eq('id', paymentId)
    .select('*, user:users(id, email, full_name)')
    .single()

  if (error || !payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  await sendPaymentRejectedEmail(
    payment.user?.email ?? '',
    payment.user?.full_name ?? 'Member',
    notes ?? ''
  ).catch(() => null)

  return NextResponse.json({ success: true })
}
