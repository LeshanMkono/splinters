import { NextRequest, NextResponse } from 'next/server'
import { recordHoneypotHit, hashIP } from '@/lib/security'

export async function POST(req: NextRequest) {
  const { path, userAgent } = await req.json().catch(() => ({}))
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const ipHash = await hashIP(ip)
  await recordHoneypotHit(ipHash, path ?? '', userAgent ?? '')
  return NextResponse.json({ ok: true })
}
