import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ─────────────────────────────────────────────────────────────────────────────
// BROWSER CLIENT
// Uses anon key + RLS. Safe to expose. Used for:
// - Realtime subscriptions (votes, polls)
// - Client-side reads
// ─────────────────────────────────────────────────────────────────────────────

let _browserClient: SupabaseClient | null = null

export function createBrowserClient(): SupabaseClient {
  if (_browserClient) return _browserClient
  _browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })
  return _browserClient
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER CLIENT
// Uses anon key + RLS. For server components reading public data.
// ─────────────────────────────────────────────────────────────────────────────

export function createServerClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CLIENT — bypasses RLS
// ONLY use in: API route handlers, cron jobs, admin operations.
// NEVER import on the client side.
// ─────────────────────────────────────────────────────────────────────────────

export function createServiceClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const PAYMENT_BUCKET = 'payment-screenshots'

/**
 * Upload a payment screenshot. Returns the storage path (not a URL).
 * Path format: "{userId}/{timestamp}-{filename}"
 */
export async function uploadPaymentScreenshot(
  userId: string,
  file: File | Blob,
  filename: string
): Promise<string> {
  const supabase = createServiceClient()
  const path = `${userId}/${Date.now()}-${filename}`

  const { error } = await supabase.storage
    .from(PAYMENT_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file instanceof File ? file.type : 'image/jpeg',
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)
  return path
}

/**
 * Generate a signed URL for a private payment screenshot.
 * Valid for 1 hour.
 */
export async function getPaymentScreenshotUrl(path: string): Promise<string> {
  const supabase = createServiceClient()
  const { data, error } = await supabase.storage
    .from(PAYMENT_BUCKET)
    .createSignedUrl(path, 3600)

  if (error || !data) throw new Error(`Signed URL failed: ${error?.message}`)
  return data.signedUrl
}
