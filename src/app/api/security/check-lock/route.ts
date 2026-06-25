import { NextRequest, NextResponse } from 'next/server'
import { checkIPLocked, hashIP } from '@/lib/security'

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const ipHash = await hashIP(ip)
  const locked = await checkIPLocked(ipHash)
  return NextResponse.json({ locked })
}
