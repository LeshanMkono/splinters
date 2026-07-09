import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase'
import { hashPassword } from '@/lib/utils'
import { sendWelcomeEmail } from '@/lib/emails'
import { checkRateLimit, getClientIP, logSOCEvent } from '@/lib/security'

const schema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)

  if (!checkRateLimit(`register:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { fullName, email, password } = parsed.data
  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email: email.toLowerCase(),
      full_name: fullName,
      password_hash: passwordHash,
      membership_status: 'pending_payment',
      role: 'member',
      nickname_set: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 })
  }

  await logSOCEvent({
    ipHash: ip,
    path: '/api/auth/register',
    method: 'POST',
    eventType: 'auth',
    anomalyScore: 0,
    metadata: { event: 'registration', email: email.toLowerCase() },
  })

  await sendWelcomeEmail(user.email, user.full_name ?? 'Member').catch(() => null)

  return NextResponse.json({ success: true, userId: user.id })
}
