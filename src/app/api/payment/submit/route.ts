import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { uploadPaymentScreenshot } from '@/lib/supabase'
import { normalizeMpesaCode } from '@/lib/utils'
import { checkRateLimit } from '@/lib/security'

// Membership fee is fixed — never trust a client-supplied amount.
const MEMBERSHIP_FEE_KES = 2000

const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!checkRateLimit(`payment:${session.user.id}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many submissions. Please wait.' }, { status: 429 })
  }

  const fd = await req.formData()
  const mpesaReference = normalizeMpesaCode(String(fd.get('mpesaReference') ?? ''))
  const month = String(fd.get('month') ?? '')
  const file = fd.get('screenshot') as File | null

  if (!mpesaReference || mpesaReference.length < 6) {
    return NextResponse.json({ error: 'Invalid M-Pesa reference.' }, { status: 400 })
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
    const ext = MIME_EXTENSIONS[file.type] ?? 'jpg'
    const filename = `screenshot-${Date.now()}.${ext}`
    const uploadRes = await uploadPaymentScreenshot(session.user.id, file, filename)
    if (uploadRes) screenshotPath = uploadRes
  }

  const { error } = await supabase.from('payments').insert({
    user_id: session.user.id,
    mpesa_reference: mpesaReference,
    amount: MEMBERSHIP_FEE_KES,
    month,
    status: 'pending',
    screenshot_url: screenshotPath,
  })

  if (error) return NextResponse.json({ error: 'Failed to submit payment.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
