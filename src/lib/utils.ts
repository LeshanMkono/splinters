import { format, getISOWeek, getYear, parseISO, isValid } from 'date-fns'

// ─────────────────────────────────────────────────────────────────────────────
// CLASS NAMES
// ─────────────────────────────────────────────────────────────────────────────

type ClassValue = string | undefined | null | false | Record<string, boolean>

export function cn(...args: ClassValue[]): string {
  const classes: string[] = []
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string') {
      classes.push(arg)
    } else if (typeof arg === 'object') {
      for (const [key, val] of Object.entries(arg)) {
        if (val) classes.push(key)
      }
    }
  }
  return classes.join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMEZONE — East Africa Time (UTC+3)
// ─────────────────────────────────────────────────────────────────────────────

export function getEATDate(date = new Date()): Date {
  return new Date(date.getTime() + 3 * 60 * 60 * 1000)
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEK ID  — format: "2025-W24-SAT" | "2025-W24-SUN"
// ─────────────────────────────────────────────────────────────────────────────

export function getWeekId(date: Date, day: 'SAT' | 'SUN'): string {
  const eatDate = getEATDate(date)
  const year = getYear(eatDate)
  const week = getISOWeek(eatDate)
  return `${year}-W${String(week).padStart(2, '0')}-${day}`
}

export function getCurrentWeekIds(): { sat: string; sun: string } {
  const now = new Date()
  return {
    sat: getWeekId(now, 'SAT'),
    sun: getWeekId(now, 'SUN'),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return format(d, 'dd MMM yyyy')
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return format(d, 'dd MMM yyyy, HH:mm')
}

// ─────────────────────────────────────────────────────────────────────────────
// CURRENCY
// ─────────────────────────────────────────────────────────────────────────────

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD HASHING — PBKDF2 via Web Crypto API (no external package)
// Works in both Node.js (API routes) and Edge (middleware)
// ─────────────────────────────────────────────────────────────────────────────

function uint8ToHex(arr: Uint8Array): string {
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
}

function hexToUint8(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return arr
}

/** Hash format: "{saltHex}.{hashHex}" (32 + 1 + 64 chars = 97 chars) */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  )
  return `${uint8ToHex(salt)}.${uint8ToHex(new Uint8Array(derived))}`
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  try {
    const [saltHex, hashHex] = stored.split('.')
    if (!saltHex || !hashHex) return false
    const saltBytes = hexToUint8(saltHex)
    const storedHash = hexToUint8(hashHex)
    const saltArr = saltBytes
    const salt: ArrayBuffer = saltArr.buffer instanceof ArrayBuffer ? saltArr.buffer.slice(saltArr.byteOffset, saltArr.byteOffset + saltArr.byteLength) : new Uint8Array(saltArr).buffer
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    const derived = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
      keyMaterial,
      256
    )
    const newHash = new Uint8Array(derived)
    if (newHash.length !== storedHash.length) return false
    // Constant-time comparison to prevent timing attacks
    let diff = 0
    for (let i = 0; i < newHash.length; i++) {
      diff |= newHash[i] ^ storedHash[i]
    }
    return diff === 0
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MISCELLANEOUS
// ─────────────────────────────────────────────────────────────────────────────

/** Clean and uppercase M-Pesa transaction codes */
export function normalizeMpesaCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1) + '…'
}
