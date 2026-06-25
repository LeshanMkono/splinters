import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

/**
 * Edge-compatible auth config — used by middleware.
 * Does NOT include the Credentials provider (full config is in auth.ts).
 * No Node.js-specific imports allowed here.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth }) {
      // Minimal check used by middleware.
      // Detailed route protection is handled in middleware.ts itself.
      return !!auth
    },
  },
}
