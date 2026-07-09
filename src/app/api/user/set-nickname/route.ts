import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const schema = z.object({
  nickname: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
})

export async function GET(req: NextRequest) {
  const check = req.nextUrl.searchParams.get('check')
  if (!check) return NextResponse.json({ error: 'Missing check param' }, { status: 400 })

  const supabase = createServiceClient()
  const { data } = await supabase.rpc('is_nickname_taken', { p_nickname: check })
  return NextResponse.json({ taken: !!data })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid nickname' }, { status: 400 })
  }

  const { nickname } = parsed.data
  const supabase = createServiceClient()

  const { data: taken } = await supabase.rpc('is_nickname_taken', { p_nickname: nickname })
  if (taken) return NextResponse.json({ error: 'Nickname is already taken.' }, { status: 409 })

  const { error } = await supabase
    .from('users')
    .update({ nickname, nickname_set: true })
    .eq('id', session.user.id)

  if (error) return NextResponse.json({ error: 'Failed to save nickname.' }, { status: 500 })

  return NextResponse.json({ success: true, nickname })
}
