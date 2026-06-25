import { NextRequest, NextResponse } from 'next/server'
import { clearLoginAttempts, hashIP } from '@/lib/security'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const ipHash = await hashIP(ip)
  await clearLoginAttempts(ipHash)
  return NextResponse.json({ ok: true })
}
