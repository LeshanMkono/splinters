import { createServiceClient } from './supabase'
import { sendSecurityAlertEmail } from './emails'

// ─────────────────────────────────────────────────────────────────────────────
// IP HASHING — SHA-256 + NEXTAUTH_SECRET salt (Web Crypto, Edge-compatible)
// ─────────────────────────────────────────────────────────────────────────────

export async function hashIP(ip: string): Promise<string> {
  const salt = process.env.NEXTAUTH_SECRET || 'splinters-fallback-salt'
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ─────────────────────────────────────────────────────────────────────────────
// BRUTE FORCE PROTECTION
// ─────────────────────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 10
const LOCK_DURATION_HOURS = 1
const ALERT_THRESHOLD = 5  // send alert email when this many attempts exceeded

export interface LoginAttemptResult {
  locked: boolean
  lockedUntil?: Date
  attemptsLeft: number
  shouldAlert: boolean
}

/** Check if an IP is currently locked out */
export async function checkIPLocked(ipHash: string): Promise<{
  locked: boolean
  lockedUntil?: Date
}> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('login_attempts')
    .select('locked_until, attempt_count')
    .eq('ip_hash', ipHash)
    .single()

  if (!data) return { locked: false }

  if (data.locked_until) {
    const lockedUntil = new Date(data.locked_until)
    if (lockedUntil > new Date()) {
      return { locked: true, lockedUntil }
    }
    // Lock expired — clear it
    await supabase
      .from('login_attempts')
      .update({ locked_until: null, attempt_count: 0, alert_sent: false })
      .eq('ip_hash', ipHash)
  }

  return { locked: false }
}

/** Record a failed login attempt. Returns updated attempt state. */
export async function recordLoginFailure(
  ipHash: string,
  emailTried: string
): Promise<LoginAttemptResult> {
  const supabase = createServiceClient()

  // Upsert the attempt record
  const { data: existing } = await supabase
    .from('login_attempts')
    .select('*')
    .eq('ip_hash', ipHash)
    .single()

  let attemptCount = (existing?.attempt_count ?? 0) + 1
  let lockedUntil: string | null = null
  let shouldAlert = false

  if (attemptCount >= MAX_ATTEMPTS) {
    const lockExpiry = new Date()
    lockExpiry.setHours(lockExpiry.getHours() + LOCK_DURATION_HOURS)
    lockedUntil = lockExpiry.toISOString()

    // Send alert if not already sent
    if (!existing?.alert_sent) {
      shouldAlert = true
      try {
        await sendSecurityAlertEmail({
          alertType: 'brute_force',
          ipHash,
          detail: `${attemptCount} failed login attempts. IP locked for ${LOCK_DURATION_HOURS} hour(s).`,
          timestamp: new Date().toISOString(),
          metadata: { email_targeted: emailTried, attempt_count: attemptCount },
        })
      } catch {
        // Don't fail the request if email fails
      }
    }
  }

  if (existing) {
    await supabase
      .from('login_attempts')
      .update({
        attempt_count: attemptCount,
        email_tried: emailTried,
        locked_until: lockedUntil,
        alert_sent: existing.alert_sent || shouldAlert,
      })
      .eq('ip_hash', ipHash)
  } else {
    await supabase.from('login_attempts').insert({
      ip_hash: ipHash,
      email_tried: emailTried,
      attempt_count: attemptCount,
      locked_until: lockedUntil,
      alert_sent: shouldAlert,
    })
  }

  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attemptCount)
  return {
    locked: attemptCount >= MAX_ATTEMPTS,
    lockedUntil: lockedUntil ? new Date(lockedUntil) : undefined,
    attemptsLeft,
    shouldAlert,
  }
}

/** Clear login attempts on successful login */
export async function clearLoginAttempts(ipHash: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase.from('login_attempts').delete().eq('ip_hash', ipHash)
}

// ─────────────────────────────────────────────────────────────────────────────
// HONEYPOT HIT LOGGING
// ─────────────────────────────────────────────────────────────────────────────

export async function recordHoneypotHit(
  ipHash: string,
  pathHit: string,
  userAgent: string
): Promise<void> {
  const supabase = createServiceClient()

  // Check if we've already alerted for this IP recently (last 24h)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const { count } = await supabase
    .from('honeypot_hits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('alert_sent', false)
    .gte('hit_at', yesterday.toISOString())

  const shouldAlert = (count ?? 0) === 0  // alert on first hit from this IP in 24h

  await supabase.from('honeypot_hits').insert({
    ip_hash: ipHash,
    path_hit: pathHit,
    user_agent: userAgent,
    alert_sent: shouldAlert,
  })

  if (shouldAlert) {
    try {
      await sendSecurityAlertEmail({
        alertType: 'honeypot',
        ipHash,
        detail: `Honeypot path accessed: ${pathHit}`,
        timestamp: new Date().toISOString(),
        metadata: { path: pathHit, user_agent: userAgent },
      })
    } catch {
      // Don't fail
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOC EVENT LOGGING
// ─────────────────────────────────────────────────────────────────────────────

export interface SOCEventInput {
  userId?: string
  eventType: string
  ipHash?: string
  path?: string
  method?: string
  statusCode?: number
  anomalyScore?: number
  metadata?: Record<string, unknown>
}

export async function logSOCEvent(event: SOCEventInput): Promise<void> {
  try {
    const supabase = createServiceClient()
    await supabase.from('soc_events').insert({
      user_id: event.userId ?? null,
      event_type: event.eventType,
      ip_hash: event.ipHash ?? null,
      path: event.path ?? null,
      method: event.method ?? 'GET',
      status_code: event.statusCode ?? 200,
      anomaly_score: event.anomalyScore ?? 0,
      metadata: event.metadata ?? {},
    })
  } catch {
    // SOC logging must never crash the request
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// IN-MEMORY RATE LIMITER
// NOTE: In serverless/edge environments, this resets per instance.
// For production-grade limiting, use Vercel KV or Upstash Redis.
// This implementation provides best-effort protection for single-instance dev.
// ─────────────────────────────────────────────────────────────────────────────

interface RateBucket {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateBucket>()

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const bucket = rateLimitStore.get(key)

  if (!bucket || now > bucket.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (bucket.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt }
  }

  bucket.count++
  return { allowed: true, remaining: maxRequests - bucket.count, resetAt: bucket.resetAt }
}

// Periodically clear expired buckets (prevents memory leak)
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (now > bucket.resetAt) rateLimitStore.delete(key)
  }
}, 60_000)
