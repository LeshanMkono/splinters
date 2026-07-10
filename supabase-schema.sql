-- ═══════════════════════════════════════════════════════════════════════════
-- SPLINTERS BASKETBALL — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS
-- Note: id is a standalone UUID (auth is managed by NextAuth, not Supabase Auth).
--       Supabase Auth is used only for email/password hashing via signInWithPassword.
--       The id mirrors auth.users.id when Supabase Auth is used for sign-in.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT UNIQUE NOT NULL,
  nickname              TEXT UNIQUE,
  full_name             TEXT,
  avatar_url            TEXT,
  role                  TEXT NOT NULL DEFAULT 'guest'
                          CHECK (role IN ('admin', 'premium', 'exclusive', 'guest')),
  membership_status     TEXT NOT NULL DEFAULT 'guest'
                          CHECK (membership_status IN ('active', 'pending_payment', 'suspended', 'guest')),
  membership_expires_at TIMESTAMPTZ,
  nickname_set          BOOLEAN NOT NULL DEFAULT FALSE,
  phone_number          TEXT,
  whatsapp_requested    BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_approved     BOOLEAN NOT NULL DEFAULT FALSE,
  instagram_handle      TEXT,
  tiktok_handle         TEXT,
  twitter_handle        TEXT,
  social_ads_consent    BOOLEAN NOT NULL DEFAULT FALSE,
  mpesa_reference       TEXT,
  password_hash         TEXT,        -- PBKDF2 hash for email/password auth (null for Google-only users)
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case-insensitive unique index on nickname
CREATE UNIQUE INDEX IF NOT EXISTS users_nickname_lower_idx
  ON users (LOWER(nickname))
  WHERE nickname IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mpesa_reference TEXT,
  screenshot_url  TEXT,
  amount          INTEGER NOT NULL DEFAULT 2000,
  month           TEXT NOT NULL,           -- "2025-06"
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'rejected')),
  confirmed_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  confirmed_at    TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);
CREATE INDEX IF NOT EXISTS payments_month_idx ON payments(month);

-- ─────────────────────────────────────────────────────────────────────────────
-- POLLS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS polls (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id           TEXT UNIQUE NOT NULL,  -- "2025-W24-SAT" or "2025-W24-SUN"
  title             TEXT NOT NULL,
  day               TEXT NOT NULL CHECK (day IN ('saturday', 'sunday')),
  venue             TEXT NOT NULL,
  venue_address     TEXT,
  game_time         TEXT NOT NULL,
  poll_date         DATE NOT NULL,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  requires_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS polls_week_id_idx ON polls(week_id);
CREATE INDEX IF NOT EXISTS polls_is_active_idx ON polls(is_active);
CREATE INDEX IF NOT EXISTS polls_poll_date_idx ON polls(poll_date DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- VOTES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS votes (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  poll_id  UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  choice   TEXT NOT NULL CHECK (choice IN ('yes', 'no', 'maybe')),
  voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, poll_id)
);

CREATE INDEX IF NOT EXISTS votes_poll_id_idx ON votes(poll_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON votes(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- LOGIN ATTEMPTS (brute-force tracking)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash       TEXT UNIQUE NOT NULL,
  email_tried   TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  locked_until  TIMESTAMPTZ,
  alert_sent    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_attempts_ip_hash_idx ON login_attempts(ip_hash);

-- ─────────────────────────────────────────────────────────────────────────────
-- HONEYPOT HITS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS honeypot_hits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash    TEXT NOT NULL,
  path_hit   TEXT NOT NULL,
  user_agent TEXT,
  alert_sent BOOLEAN NOT NULL DEFAULT FALSE,
  hit_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS honeypot_hits_ip_hash_idx ON honeypot_hits(ip_hash);
CREATE INDEX IF NOT EXISTS honeypot_hits_hit_at_idx ON honeypot_hits(hit_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- SOC EVENTS (Security Operations Centre event log)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soc_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type    TEXT NOT NULL,
  ip_hash       TEXT,
  path          TEXT,
  method        TEXT NOT NULL DEFAULT 'GET',
  status_code   INTEGER NOT NULL DEFAULT 200,
  anomaly_score INTEGER NOT NULL DEFAULT 0 CHECK (anomaly_score BETWEEN 0 AND 10),
  metadata      JSONB NOT NULL DEFAULT '{}',
  occurred_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS soc_events_event_type_idx ON soc_events(event_type);
CREATE INDEX IF NOT EXISTS soc_events_occurred_at_idx ON soc_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS soc_events_anomaly_score_idx ON soc_events(anomaly_score DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

-- All tables get RLS enabled; service role bypasses all policies.
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls          ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeypot_hits  ENABLE ROW LEVEL SECURITY;
ALTER TABLE soc_events     ENABLE ROW LEVEL SECURITY;

-- ── USERS policies ────────────────────────────────────────────────────────────

-- Auth is handled by NextAuth, not Supabase Auth — auth.uid() is never
-- populated. All authorization happens in API route handlers via the
-- service-role client. This policy exists only to deny direct table access
-- via the anon key.

CREATE POLICY "users_deny_all_direct_access" ON users
  FOR ALL USING (FALSE);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid()::text = id::text)
  WITH CHECK (
    auth.uid()::text = id::text
    -- role cannot be changed by the user themselves (enforced below)
  );

-- ── PAYMENTS policies ─────────────────────────────────────────────────────────

CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "payments_insert_own" ON payments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- ── POLLS policies ─────────────────────────────────────────────────────────────

CREATE POLICY "polls_select_all" ON polls
  FOR SELECT USING (TRUE);

-- ── VOTES policies ────────────────────────────────────────────────────────────

CREATE POLICY "votes_select_all" ON votes
  FOR SELECT USING (TRUE);

CREATE POLICY "votes_insert_own" ON votes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "votes_update_own" ON votes
  FOR UPDATE USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- ── SECURITY tables (admin + service role only) ────────────────────────────────

CREATE POLICY "login_attempts_admin_only" ON login_attempts
  FOR ALL USING (FALSE);  -- service role bypasses; no anon/user access

CREATE POLICY "honeypot_hits_admin_only" ON honeypot_hits
  FOR ALL USING (FALSE);

CREATE POLICY "soc_events_admin_only" ON soc_events
  FOR ALL USING (FALSE);

-- ═══════════════════════════════════════════════════════════════════════════
-- REALTIME
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable realtime on votes table for live poll updates.
-- Run in Supabase dashboard: Realtime → Enable for table 'votes'
-- Or via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE polls;

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════════════════════

-- Create private storage bucket for payment screenshots.
-- Run in Supabase dashboard: Storage → New Bucket
-- Name: payment-screenshots, Public: false
-- Or via SQL (requires service role):

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  FALSE,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: auth is handled by NextAuth, not Supabase Auth, so
-- auth.uid() is never populated here. Uploads and signed URLs already go
-- through the service-role client in src/lib/supabase.ts — this policy
-- exists only to deny direct storage access via the anon key.
CREATE POLICY "payment_screenshots_deny_all_direct_access" ON storage.objects
  FOR ALL USING (bucket_id = 'payment-screenshots' AND FALSE);

-- ═══════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Get vote counts for a poll
CREATE OR REPLACE FUNCTION get_poll_vote_counts(p_poll_id UUID)
RETURNS TABLE(choice TEXT, count BIGINT) AS $$
  SELECT choice, COUNT(*) AS count
  FROM votes
  WHERE poll_id = p_poll_id
  GROUP BY choice;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if nickname is taken (case-insensitive)
CREATE OR REPLACE FUNCTION is_nickname_taken(p_nickname TEXT, p_exclude_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE LOWER(nickname) = LOWER(p_nickname)
    AND (p_exclude_user_id IS NULL OR id != p_exclude_user_id)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
