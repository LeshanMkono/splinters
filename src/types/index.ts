// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'premium' | 'exclusive' | 'guest'
export type MembershipStatus = 'active' | 'pending_payment' | 'suspended' | 'guest'
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected'
export type VoteChoice = 'yes' | 'no' | 'maybe'
export type PollDay = 'saturday' | 'sunday'
export type CourtSurface = 'hardwood' | 'concrete' | 'asphalt' | 'tartan'
export type CourtType = 'indoor' | 'outdoor'

// ─────────────────────────────────────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  nickname: string | null
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  membership_status: MembershipStatus
  membership_expires_at: string | null
  nickname_set: boolean
  phone_number: string | null
  whatsapp_requested: boolean
  whatsapp_approved: boolean
  instagram_handle: string | null
  tiktok_handle: string | null
  twitter_handle: string | null
  social_ads_consent: boolean
  mpesa_reference: string | null
  password_hash?: string | null
  created_at: string
}

export type UserPublic = Pick<
  User,
  'id' | 'nickname' | 'full_name' | 'avatar_url' | 'role' | 'membership_status'
>

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT
// ─────────────────────────────────────────────────────────────────────────────

export interface Payment {
  id: string
  user_id: string
  mpesa_reference: string | null
  screenshot_url: string | null
  amount: number
  month: string
  status: PaymentStatus
  confirmed_by: string | null
  confirmed_at: string | null
  notes: string | null
  created_at: string
  user?: Pick<User, 'id' | 'email' | 'nickname' | 'full_name'>
}

// ─────────────────────────────────────────────────────────────────────────────
// POLL & VOTE
// ─────────────────────────────────────────────────────────────────────────────

export interface Poll {
  id: string
  week_id: string
  title: string
  day: PollDay
  venue: string
  venue_address: string | null
  game_time: string
  poll_date: string
  is_active: boolean
  requires_exclusive: boolean
  created_at: string
}

export interface Vote {
  id: string
  user_id: string
  poll_id: string
  choice: VoteChoice
  voted_at: string
  user?: Pick<User, 'id' | 'nickname' | 'avatar_url'>
}

export interface VoteCounts {
  yes: number
  no: number
  maybe: number
  total: number
}

export interface PollWithVotes extends Poll {
  votes: Vote[]
  voteCounts: VoteCounts
  userVote: VoteChoice | null
}

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginAttempt {
  id: string
  ip_hash: string
  email_tried: string | null
  attempt_count: number
  locked_until: string | null
  alert_sent: boolean
  created_at: string
}

export interface HoneypotHit {
  id: string
  ip_hash: string
  path_hit: string
  user_agent: string | null
  alert_sent: boolean
  hit_at: string
}

export interface SOCEvent {
  id: string
  user_id: string | null
  event_type: string
  ip_hash: string | null
  path: string | null
  method: string
  status_code: number
  anomaly_score: number
  metadata: Record<string, unknown>
  occurred_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// COURTS
// ─────────────────────────────────────────────────────────────────────────────

export interface Court {
  id: string
  name: string
  slug: string
  address: string
  district: string
  lat: number
  lng: number
  surface: CourtSurface
  type: CourtType
  hoops: number
  is_featured: boolean
  lighting: boolean
  description: string | null
  image_url: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE ENVELOPE
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE DATABASE TYPE (used with createClient<Database>)
// ─────────────────────────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<User>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Payment>
      }
      polls: {
        Row: Poll
        Insert: Omit<Poll, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Poll>
      }
      votes: {
        Row: Vote
        Insert: Omit<Vote, 'id' | 'voted_at'> & { id?: string; voted_at?: string }
        Update: Partial<Vote>
      }
      login_attempts: {
        Row: LoginAttempt
        Insert: Omit<LoginAttempt, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<LoginAttempt>
      }
      honeypot_hits: {
        Row: HoneypotHit
        Insert: Omit<HoneypotHit, 'id' | 'hit_at'> & { id?: string; hit_at?: string }
        Update: Partial<HoneypotHit>
      }
      soc_events: {
        Row: SOCEvent
        Insert: Omit<SOCEvent, 'id' | 'occurred_at'> & { id?: string; occurred_at?: string }
        Update: Partial<SOCEvent>
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
