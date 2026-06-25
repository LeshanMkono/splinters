import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { uploadPaymentScreenshot } from '@/lib/supabase'
import { normalizeMpesaCode } from '@/lib/utils'
import { checkRateLimit } from '@/lib/security'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(`payment:${session.user.id}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many submissions. Please wait.' }, { status: 429 })
  }

  const fd = await req.formData()
  const mpesaReference = normalizeMpesaCode(String(fd.get('mpesaReference') ?? ''))
  const amount = Number(fd.get('amount') ?? 0)
  const month = String(fd.get('month') ?? '')
  const file = fd.get('screenshot') as File | null

  if (!mpesaReference || mpesaReference.length < 6) {
    return NextResponse.json({ error: 'Invalid M-Pesa reference.' }, { status: 400 })
  }
  if (amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Check for duplicate reference
  const { data: dup } = await supabase
    .from('payments')
    .select('id')
    .eq('mpesa_reference', mpesaReference)
    .maybeSingle()

  if (dup) {
    return NextResponse.json({ error: 'This M-Pesa reference has already been submitted.' }, { status: 409 })
  }

  let screenshotPath: string | null = null
  if (file && file.size > 0) {
    const uploadRes = await uploadPaymentScreenshot(session.user.id, file, file.type)
    if (uploadRes) screenshotPath = uploadRes
  }

  const { error } = await supabase.from('payments').insert({
    user_id: session.user.id,
    mpesa_reference: mpesaReference,
    amount,
    month,
    status: 'pending',
    screenshot_url: screenshotPath,
  })

  if (error) return NextResponse.json({ error: 'Failed to submit payment.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
