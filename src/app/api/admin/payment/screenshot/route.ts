import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { getPaymentScreenshotUrl } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const paymentId = req.nextUrl.searchParams.get('paymentId')
  if (!paymentId) return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 })

  const supabase = createServiceClient()
  const { data: payment } = await supabase
    .from('payments')
    .select('screenshot_url')
    .eq('id', paymentId)
    .single()

  if (!payment?.screenshot_url) return NextResponse.json({ error: 'No screenshot' }, { status: 404 })

  const url = await getPaymentScreenshotUrl(payment.screenshot_url)
  if (!url) return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 })

  return NextResponse.json({ url })
}
