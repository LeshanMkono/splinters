import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { pollId, isActive } = await req.json()
  if (!pollId) return NextResponse.json({ error: 'Missing pollId' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from('polls').update({ is_active: isActive }).eq('id', pollId)
  if (error) return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 })

  return NextResponse.json({ success: true })
}
