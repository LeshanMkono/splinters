import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextRequest, NextResponse } from 'next/server'
import type { Session } from 'next-auth'
import { getClientIP } from '@/lib/security'

const { auth } = NextAuth(authConfig)

// ─────────────────────────────────────────────────────────────────────────────
// HONEYPOT PATHS — attackers probing for common vulnerabilities
// Return a fake 200 to waste their time, log the hit asynchronously
// ─────────────────────────────────────────────────────────────────────────────

const HONEYPOT_PATHS = [
  '/wp-admin',
  '/wp-login.php',
  '/phpmyadmin',
  '/admin/login',
  '/.env',
  '/config.php',
  '/xmlrpc.php',
  '/.git/config',
  '/administrator',
  '/setup.php',
  '/install.php',
  '/backup.zip',
  '/db.sql',
  '/shell.php',
  '/c99.php',
  '/.htaccess',
]

function isHoneypotPath(pathname: string): boolean {
  return HONEYPOT_PATHS.some(
    p => pathname === p || pathname.startsWith(p + '/')
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PROTECTION RULES
// ─────────────────────────────────────────────────────────────────────────────

/** Requires a valid session */
const MEMBER_PATHS = ['/dashboard', '/courts', '/api/vote', '/api/user']

/** Requires role = 'admin' */
const ADMIN_PATHS = ['/admin', '/api/admin']

/** Auth pages (redirect away if already logged in) */
const AUTH_PAGES = ['/auth/login', '/auth/register', '/auth/error']

function requiresMember(pathname: string): boolean {
  return MEMBER_PATHS.some(p => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'))
}

function requiresAdmin(pathname: string): boolean {
  return ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
}

function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some(p => pathname === p || pathname.startsWith(p + '/'))
}

// ─────────────────────────────────────────────────────────────────────────────
// IN-EDGE RATE LIMITER
// Uses a simple Map — best effort in serverless (resets per cold start).
// ─────────────────────────────────────────────────────────────────────────────

interface Bucket { count: number; resetAt: number }
// TODO: replace with Upstash Redis / Vercel KV for cross-instance rate limiting
const rateBuckets = new Map<string, Bucket>()

function edgeRateLimit(
  key: string,
  max: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const bucket = rateBuckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= max) return false
  bucket.count++
  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

export default auth(async function middleware(
  req: NextRequest & { auth: Session | null }
) {
  const { pathname } = req.nextUrl
  const session = req.auth
  const ip = getClientIP(req)

  // ── 1. Honeypot detection ──────────────────────────────────────────────────
  if (isHoneypotPath(pathname)) {
    // Log hit asynchronously (don't await — don't slow the response)
    void fetch(`${req.nextUrl.origin}/api/security/honeypot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        ip,
        userAgent: req.headers.get('user-agent') || '',
      }),
    }).catch(() => {})

    // Return fake 200 — waste attacker time, don't reveal 404
    return new Response(
      '<!DOCTYPE html><html><head><title>Not Found</title></head><body><h1>Not Found</h1></body></html>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }

  // ── 2. Rate limiting ───────────────────────────────────────────────────────
  const isAuthRoute = pathname.startsWith('/api/auth') || pathname.startsWith('/auth/')
  const isApiRoute = pathname.startsWith('/api/')

  if (isAuthRoute && (isApiRoute || req.method !== 'GET')) {
    // Auth routes: 10 requests per minute per IP (only API calls and form submissions, not page loads)
    const key = `auth:${ip}`
    if (!edgeRateLimit(key, 10, 60_000)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait before trying again.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  } else if (isApiRoute) {
    // General API routes: 60 requests per minute per IP
    const key = `api:${ip}`
    if (!edgeRateLimit(key, 60, 60_000)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  // ── 3. Admin protection ────────────────────────────────────────────────────
  if (requiresAdmin(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + encodeURIComponent(req.url), req.url))
    }
    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // ── 4. Member protection ───────────────────────────────────────────────────
  if (requiresMember(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + encodeURIComponent(req.url), req.url))
    }
  }

  // Poll pages are accessible to all (anonymous users see results but can't vote)
  // /poll/* is NOT in MEMBER_PATHS intentionally

  // ── 5. Redirect logged-in users away from auth pages ──────────────────────
  if (session && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

// ─────────────────────────────────────────────────────────────────────────────
// MATCHER — which paths the middleware runs on
// Exclude static assets, images, favicons
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
