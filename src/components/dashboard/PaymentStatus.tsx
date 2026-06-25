import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import type { MembershipStatus, Payment } from '@/types'
import { PaymentBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface PaymentStatusProps {
  membershipStatus: MembershipStatus
  recentPayments?: Payment[]
  latestPayment?: Payment | null
  payments?: Payment[]
}

export function PaymentStatus({ membershipStatus, recentPayments, payments }: PaymentStatusProps) {
  const resolvedPayments = recentPayments ?? payments ?? []
  const recentPayments_ = resolvedPayments
  const showReminder =
    membershipStatus === 'pending_payment' || membershipStatus === 'guest'

  return (
    <div className="space-y-6">
      {/* ── Payment reminder (shown when not active) ───────────────────────── */}
      {showReminder && (
        <div className="bg-orange/5 border border-orange/20 rounded-xl p-5 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-navy mb-1">Membership payment required</p>
            <p className="text-mid text-sm leading-relaxed mb-4">
              Pay via M-Pesa (Paybill <strong>880100</strong>, Account <strong>payslinters25</strong>, KES 2,000) then upload your screenshot to activate your membership.
            </p>
            <Link
              href="/auth/payment"
              className="inline-block px-5 py-2.5 rounded bg-orange text-white font-semibold text-sm hover:bg-orange-dark transition-colors"
            >
              Activate Membership →
            </Link>
          </div>
        </div>
      )}

      {membershipStatus === 'active' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex gap-4">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 mb-1">Membership active</p>
            <p className="text-green-700 text-sm">
              You have full access. Remember to renew on the 28th of each month.
            </p>
          </div>
        </div>
      )}

      {/* ── Recent payments table ───────────────────────────────────────────── */}
      {recentPayments_.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-mid" />
            <h3 className="font-semibold text-navy text-sm">Recent Payments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 font-mono text-xs text-mid uppercase tracking-wide">Month</th>
                  <th className="text-left px-5 py-3 font-mono text-xs text-mid uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3 font-mono text-xs text-mid uppercase tracking-wide">M-Pesa Ref</th>
                  <th className="text-left px-5 py-3 font-mono text-xs text-mid uppercase tracking-wide">Submitted</th>
                  <th className="text-left px-5 py-3 font-mono text-xs text-mid uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments_.map(payment => (
                  <tr key={payment.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-medium text-navy">{payment.month}</td>
                    <td className="px-5 py-3.5 text-mid">KES {payment.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-mid">
                      {payment.mpesa_reference || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-mid">{formatDate(payment.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <PaymentBadge status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
