import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const schema = z.object({
  full_name: z.string().min(2).max(80).optional(),
  phone_number: z.string().max(20).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('users')
    .select(
      'id, email, full_name, nickname, avatar_url, role, membership_status, ' +
      'membership_expires_at, phone_number, whatsapp_requested, whatsapp_approved, ' +
      'instagram_handle, tiktok_handle, twitter_handle'
    )
    .eq('id', session.user.id)
    .single()
  if (error) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ user: data })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('users').update(parsed.data).eq('id', session.user.id)
  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ success: true })
}
