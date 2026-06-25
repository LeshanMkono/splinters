'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { ExternalLink, CheckCircle, XCircle, Search } from 'lucide-react'
import { PaymentBadge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { formatDate, formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Payment } from '@/types'

interface PaymentsTabProps {
  payments: Payment[]
  onRefresh: () => void
}

export function PaymentsTab({ payments, onRefresh }: PaymentsTabProps) {
  const { success, error: showError } = useToast()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [loadingScreenshot, setLoadingScreenshot] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filtered = payments.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (p.mpesa_reference || '').toLowerCase().includes(q) ||
      (p.user?.email || '').toLowerCase().includes(q) ||
      (p.user?.nickname || '').toLowerCase().includes(q) ||
      p.month.includes(q)
    )
  })

  async function viewScreenshot(paymentId: string) {
    setLoadingScreenshot(true)
    setSelectedId(paymentId)
    setScreenshotUrl(null)
    try {
      const res = await fetch(`/api/admin/payment/screenshot?paymentId=${paymentId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setScreenshotUrl(data.url)
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load screenshot')
    } finally {
      setLoadingScreenshot(false)
    }
  }

  async function handlePaymentAction(paymentId: string, action: 'confirm' | 'reject', notes?: string) {
    startTransition(async () => {
      try {
        const endpoint = action === 'confirm'
          ? '/api/admin/payment/confirm'
          : '/api/admin/payment/reject'
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, notes }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed')
        success(action === 'confirm' ? 'Payment confirmed! Member activated.' : 'Payment rejected.')
        setSelectedId(null)
        setScreenshotUrl(null)
        onRefresh()
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Error')
      }
    })
  }

  const selectedPayment = payments.find(p => p.id === selectedId)

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid" />
        <input
          type="text"
          placeholder="Search M-Pesa ref, member, month…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
        />
      </div>

      <div className={cn('grid gap-5', selectedId ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Member</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">M-Pesa Ref</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Month</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Submitted</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs text-mid uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-mid text-sm">No payments found</td></tr>
                )}
                {filtered.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => viewScreenshot(p.id)}
                    className={cn(
                      'border-b border-gray-50 cursor-pointer hover:bg-orange/5 transition-colors',
                      selectedId === p.id && 'bg-orange/10'
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy">{p.user?.nickname || p.user?.full_name || '—'}</p>
                      <p className="text-xs text-mid">{p.user?.email || '—'}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-mid">{p.mpesa_reference || '—'}</td>
                    <td className="px-5 py-3.5 text-mid">{p.month}</td>
                    <td className="px-5 py-3.5 text-mid">KES {p.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-mid">{formatDate(p.created_at)}</td>
                    <td className="px-5 py-3.5"><PaymentBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Screenshot + action panel */}
        {selectedId && selectedPayment && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-navy">Payment Review</h3>
              <button onClick={() => { setSelectedId(null); setScreenshotUrl(null) }} className="text-mid hover:text-navy text-sm">✕ Close</button>
            </div>

            {/* Details */}
            <div className="space-y-1.5 text-sm">
              <p className="text-mid"><span className="text-navy font-medium">Member:</span> {selectedPayment.user?.nickname || selectedPayment.user?.email}</p>
              <p className="text-mid"><span className="text-navy font-medium">M-Pesa:</span> {selectedPayment.mpesa_reference || '—'}</p>
              <p className="text-mid"><span className="text-navy font-medium">Amount:</span> KES {selectedPayment.amount.toLocaleString()}</p>
              <p className="text-mid"><span className="text-navy font-medium">Month:</span> {selectedPayment.month}</p>
              <p className="text-mid"><span className="text-navy font-medium">Submitted:</span> {formatDateTime(selectedPayment.created_at)}</p>
            </div>

            {/* Screenshot */}
            <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 min-h-40 flex items-center justify-center">
              {loadingScreenshot && (
                <p className="text-mid text-sm">Loading screenshot…</p>
              )}
              {!loadingScreenshot && !screenshotUrl && !selectedPayment.screenshot_url && (
                <p className="text-mid text-sm">No screenshot uploaded</p>
              )}
              {!loadingScreenshot && screenshotUrl && (
                <div className="relative w-full">
                  <Image src={screenshotUrl} alt="Payment screenshot" width={600} height={400} className="w-full h-auto object-contain max-h-64" />
                  <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-white rounded p-1 shadow">
                    <ExternalLink className="w-4 h-4 text-navy" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedPayment.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handlePaymentAction(selectedId, 'confirm')}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Confirm
                </button>
                <button
                  onClick={() => handlePaymentAction(selectedId, 'reject')}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
