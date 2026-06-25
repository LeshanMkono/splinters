import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { sendAccountSuspendedEmail } from '@/lib/emails'
import { z } from 'zod'

const schema = z.object({
  userId: z.string().uuid(),
  action: z.enum(['confirm', 'reject', 'suspend', 'approve_whatsapp']),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { userId, action } = parsed.data
  const supabase = createServiceClient()

  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (action === 'confirm') {
    await supabase.from('users').update({ membership_status: 'active' }).eq('id', userId)
  } else if (action === 'reject') {
    await supabase.from('users').update({ membership_status: 'pending_payment' }).eq('id', userId)
  } else if (action === 'suspend') {
    if (user.role === 'admin') return NextResponse.json({ error: 'Cannot suspend admin' }, { status: 400 })
    await supabase.from('users').update({ membership_status: 'suspended' }).eq('id', userId)
    await sendAccountSuspendedEmail(user.email, user.full_name ?? 'Member').catch(() => null)
  } else if (action === 'approve_whatsapp') {
    await supabase.from('users').update({ whatsapp_approved: true }).eq('id', userId)
  }

  return NextResponse.json({ success: true })
}
