'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function SetupPage() {
  const router = useRouter()
  const { update } = useSession()
  const [nickname, setNickname] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function checkNickname(value: string) {
    setNickname(value)
    setAvailable(null)
    if (value.length < 3) return
    setChecking(true)
    const res = await fetch(`/api/user/set-nickname?check=${encodeURIComponent(value)}`)
    const data = await res.json()
    setChecking(false)
    setAvailable(!data.taken)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!available) { setError('Please choose an available nickname.'); return }

    setIsSaving(true)

    let data: { success?: boolean; nickname?: string; error?: string }
    try {
      const res = await fetch('/api/user/set-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      })
      data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to set nickname.')
        setIsSaving(false)
        return
      }
    } catch {
      setError('Network error. Please try again.')
      setIsSaving(false)
      return
    }

    // Refresh the session so the new nickname/nickname_set are available on
    // /dashboard. If update() throws or isn't available, fall back to a
    // router refresh so the redirect still gets a re-validated session.
    try {
      if (typeof update === 'function') {
        await update({ nickname: data.nickname ?? nickname, nickname_set: true })
      } else {
        router.refresh()
      }
    } catch {
      router.refresh()
    }

    // Deliberately leave isSaving true — the page is navigating away, so the
    // button should keep showing "Saving…" until the redirect completes.
    router.push('/dashboard?welcome=1')
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 transition-colors'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/images/Splintersbasketball.png" alt="Splinters" width={40} height={40} className="rounded" />
          <span className="font-display text-2xl text-navy tracking-widest">SPLINTERS</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h1 className="text-2xl font-display text-navy mb-1 tracking-wide">CHOOSE YOUR NAME</h1>
          <p className="text-sm text-mid mb-6">
            Pick a nickname — this is how other players will know you on court.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Nickname</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={24}
                  placeholder="e.g. Flash, BigO, Buckets"
                  value={nickname}
                  onChange={e => checkNickname(e.target.value.trim())}
                  className={
                    inputClass +
                    (available === true
                      ? ' border-green-400 focus:border-green-400'
                      : available === false
                      ? ' border-red-300 focus:border-red-300'
                      : ' border-gray-200 focus:border-orange')
                  }
                />
                {checking && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mid">…</span>
                )}
                {!checking && available === true && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600">✓ Available</span>
                )}
                {!checking && available === false && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">✗ Taken</span>
                )}
              </div>
              <p className="text-xs text-mid mt-1.5">3–24 characters. Letters, numbers, underscores only.</p>
            </div>

            <button
              type="submit"
              disabled={isSaving || !available}
              className="w-full py-3 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving…' : 'Set Nickname & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
