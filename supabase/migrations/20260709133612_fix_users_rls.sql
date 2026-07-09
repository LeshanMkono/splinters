-- ═══════════════════════════════════════════════════════════════════════════
-- FIX: users table RLS leak + dead auth.uid()-based storage policies
--
-- Auth is handled by NextAuth, not Supabase Auth — auth.uid() is never
-- populated for requests from this app. All authorization happens in API
-- route handlers via the service-role client (which bypasses RLS entirely).
-- These policies exist only to deny direct table/storage access via the
-- anon key; they are not meant to implement per-row access control.
--
-- "users_select_own" previously read:
--   FOR SELECT USING (auth.uid()::text = id::text OR TRUE)
-- The `OR TRUE` makes the policy always pass, so the anon key can read
-- every column of every user row (including password_hash, phone_number,
-- mpesa_reference) directly via the Supabase REST API, bypassing the app
-- entirely. The payment-screenshots storage policies had the same
-- auth.uid()-based pattern (dead code, since auth.uid() is always NULL here).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── users ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_no_self_role_update" ON users;

CREATE POLICY "users_deny_all_direct_access" ON users
  FOR ALL USING (FALSE);

-- ── payment-screenshots storage ─────────────────────────────────────────
DROP POLICY IF EXISTS "payment_screenshots_upload_own" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_select_own" ON storage.objects;

CREATE POLICY "payment_screenshots_deny_all_direct_access" ON storage.objects
  FOR ALL USING (bucket_id = 'payment-screenshots' AND FALSE);
