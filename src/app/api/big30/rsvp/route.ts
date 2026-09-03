import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, getClientIP } from '@/lib/security'
import { sendBig30RsvpEmail } from '@/lib/emails'

// RSVP form on the static invite at /big30 posts here. No auth, no DB —
// each submission is emailed to the host via Resend.
const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number')
    .max(20)
    .regex(/^[0-9+()\-.\s]+$/, 'Please enter a valid phone number'),
  email: z.string().trim().email('Please enter a valid email').max(120),
})

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)

  const rate = checkRateLimit(`big30-rsvp:${ip}`, 5, 60_000)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  const { name, phone, email } = parsed.data

  try {
    await sendBig30RsvpEmail({
      name,
      phone,
      email,
      submittedAt: new Date().toLocaleString('en-KE', {
        timeZone: 'Africa/Nairobi',
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    })
  } catch {
    return NextResponse.json(
      { error: 'Could not send your RSVP. Please try again in a moment.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
