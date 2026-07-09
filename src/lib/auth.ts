import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { authConfig } from './auth.config'
import { createServiceClient } from './supabase'
import { verifyPassword } from './utils'
import { checkIPLocked, clearLoginAttempts, getClientIP, hashIP, recordLoginFailure } from './security'

// ─────────────────────────────────────────────────────────────────────────────
// TYPE AUGMENTATION
// ─────────────────────────────────────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      image: string | null
      role: 'admin' | 'premium' | 'exclusive' | 'guest'
      nickname: string | null
      nickname_set: boolean
      membership_status: 'active' | 'pending_payment' | 'suspended' | 'guest'
    }
  }
  interface User {
    id: string
    role?: 'admin' | 'premium' | 'exclusive' | 'guest'
    nickname?: string | null
    nickname_set?: boolean
    membership_status?: 'active' | 'pending_payment' | 'suspended' | 'guest'
  }
}

// JWT is augmented via the session callback; token fields are cast explicitly below

// ─────────────────────────────────────────────────────────────────────────────
// CREDENTIALS SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE USER HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function getOrCreateGoogleUser(profile: {
  email: string
  name: string | null
  image: string | null
}) {
  const supabase = createServiceClient()

  // Try to find existing user by email
  const { data: existing } = await supabase
    .from('users')
    .select('id, email, role, nickname, nickname_set, membership_status')
    .eq('email', profile.email)
    .single()

  if (existing) return existing

  // Create new user for Google sign-in
  const { data: created, error } = await supabase
    .from('users')
    .insert({
      email: profile.email,
      full_name: profile.name,
      avatar_url: profile.image,
      role: 'guest',
      membership_status: 'guest',
      nickname_set: false,
    })
    .select('id, email, role, nickname, nickname_set, membership_status')
    .single()

  if (error || !created) {
    throw new Error(`Failed to create user: ${error?.message}`)
  }

  return created
}

async function getUserByEmail(email: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('users')
    .select('id, email, password_hash, role, nickname, nickname_set, membership_status')
    .eq('email', email.toLowerCase())
    .single()
  return data
}

// ─────────────────────────────────────────────────────────────────────────────
// NEXTAUTH CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),

    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        // Lockout is enforced here, server-side, so it can't be bypassed or
        // self-served by an attacker calling a public endpoint directly.
        const ip = getClientIP(request)
        const ipHash = await hashIP(ip)

        const { locked } = await checkIPLocked(ipHash)
        if (locked) return null

        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const user = await getUserByEmail(email)
        if (!user || !user.password_hash) {
          await recordLoginFailure(ipHash, email)
          return null
        }

        const valid = await verifyPassword(password, user.password_hash)
        if (!valid) {
          await recordLoginFailure(ipHash, email)
          return null
        }

        await clearLoginAttempts(ipHash)

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          nickname: user.nickname,
          nickname_set: user.nickname_set,
          membership_status: user.membership_status,
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Google OAuth — upsert user in our database
      if (account?.provider === 'google' && user.email) {
        try {
          const dbUser = await getOrCreateGoogleUser({
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
          })
          // Store db fields on user object so jwt callback can pick them up
          user.id = dbUser.id
          ;(user as any).role = dbUser.role
          ;(user as any).nickname = dbUser.nickname
          ;(user as any).nickname_set = dbUser.nickname_set
          ;(user as any).membership_status = dbUser.membership_status
        } catch {
          return false
        }
      }
      return true
    },

    async jwt({ token, user, trigger }) {
      // On initial sign-in, populate token from user object
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? 'guest'
        token.nickname = (user as any).nickname ?? null
        token.nickname_set = (user as any).nickname_set ?? false
        token.membership_status = (user as any).membership_status ?? 'guest'
      }

      // On session update (e.g., after nickname is set), never trust
      // client-supplied session data for these fields — any authenticated
      // client can call NextAuth's update() with an arbitrary payload, and
      // trusting it verbatim would be a privilege-escalation path. Re-fetch
      // fresh values from the database instead.
      if (trigger === 'update' && token.id) {
        const supabase = createServiceClient()
        const { data } = await supabase
          .from('users')
          .select('role, nickname, nickname_set, membership_status')
          .eq('id', token.id as string)
          .single()

        if (data) {
          token.role = data.role
          token.nickname = data.nickname
          token.nickname_set = data.nickname_set
          token.membership_status = data.membership_status
        }
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as 'admin' | 'premium' | 'exclusive' | 'guest'
      session.user.nickname = token.nickname as string | null
      session.user.nickname_set = token.nickname_set as boolean
      session.user.membership_status = token.membership_status as 'guest' | 'active' | 'pending_payment' | 'suspended'
      return session
    },
  },
})
