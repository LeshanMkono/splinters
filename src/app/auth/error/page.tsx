'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AlertTriangle } from 'lucide-react'

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'Server configuration issue. Please contact support.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification: 'The verification link has expired or has already been used.',
  OAuthSignin: 'An error occurred while signing in with this provider.',
  OAuthCallback: 'An error occurred during the OAuth callback.',
  OAuthCreateAccount: 'Could not create an account using this provider.',
  EmailCreateAccount: 'Could not create an account with this email.',
  Callback: 'An unexpected error occurred during authentication.',
  OAuthAccountNotLinked: 'This email is already registered. Please sign in using the original method.',
  Default: 'An unexpected authentication error occurred.',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get('error') || 'Default'
  const message = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.Default

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/images/Splintersbasketball.png" alt="Splinters" width={40} height={40} className="rounded" />
          <span className="font-display text-2xl text-navy tracking-widest">SPLINTERS</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          <h1 className="text-xl font-display text-navy mb-2 tracking-wide">AUTH ERROR</h1>
          <p className="text-sm text-mid mb-6">{message}</p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full py-3 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full py-3 rounded-lg border border-gray-200 text-mid text-sm hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>

          {errorCode && errorCode !== 'Default' && (
            <p className="text-xs text-mid/50 font-mono mt-4">Error code: {errorCode}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <AuthErrorContent />
    </Suspense>
  )
}
