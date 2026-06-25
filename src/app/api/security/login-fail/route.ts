import { NextRequest, NextResponse } from 'next/server'
import { recordLoginFailure, hashIP } from '@/lib/security'

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const ipHash = await hashIP(ip)
  await recordLoginFailure(ipHash, email ?? '')
  return NextResponse.json({ ok: true })
}
