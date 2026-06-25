'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { formatKES } from '@/lib/utils'

const MONTHLY_FEE = 2000

export default function PaymentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [mpesaRef, setMpesaRef] = useState('')
  const [amount, setAmount] = useState(String(MONTHLY_FEE))
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) { showError('Please upload an image file.'); return }
    if (f.size > 5 * 1024 * 1024) { showError('Image must be under 5MB.'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!mpesaRef) { showError('Please enter your M-Pesa reference code.'); return }
    startTransition(async () => {
      const fd = new FormData()
      fd.append('mpesaReference', mpesaRef.toUpperCase())
      fd.append('amount', amount)
      fd.append('month', month)
      if (file) fd.append('screenshot', file)
      const res = await fetch('/api/payment/submit', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { showError(data.error || 'Submission failed.'); return }
      success('Payment submitted! Admin will verify within 24 hours.')
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-display text-navy mb-2 tracking-wide">SUBMITTED!</h2>
          <p className="text-mid text-sm mb-6">Your payment is under review. You&apos;ll be notified once activated.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/images/Splintersbasketball.png" alt="Splinters" width={40} height={40} className="rounded" />
          <span className="font-display text-2xl text-navy tracking-widest">SPLINTERS</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h1 className="text-2xl font-display text-navy mb-1 tracking-wide">PAY MEMBERSHIP</h1>
          <p className="text-sm text-mid mb-6">Send via M-Pesa then submit your payment details below.</p>

          {/* M-Pesa instructions */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
            <p className="text-xs font-mono text-green-800 uppercase tracking-wide mb-2">M-Pesa Instructions</p>
            <ol className="text-sm text-green-700 space-y-1.5">
              <li>1. Go to <strong>M-Pesa</strong> → Send Money</li>
              <li>2. Send <strong>{formatKES(MONTHLY_FEE)}</strong> to <strong>0712 345 678</strong></li>
              <li>3. Save the <strong>transaction code</strong> (e.g. QAB1X2Y3Z)</li>
              <li>4. Fill in the form below and attach a screenshot</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">M-Pesa Reference *</label>
              <input
                type="text"
                required
                placeholder="e.g. QAB1X2Y3Z"
                value={mpesaRef}
                onChange={e => setMpesaRef(e.target.value)}
                className={inputClass + ' uppercase'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Amount (KES)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className={inputClass}
                  min={1}
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">For Month</label>
                <input type="month" value={month} onChange={e => setMonth(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Screenshot upload */}
            <div>
              <label className="block text-xs font-mono text-mid uppercase tracking-wide mb-1.5">Screenshot (optional)</label>
              <div
                className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('screenshot-input')?.click()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded" />
                ) : (
                  <div className="text-center text-mid">
                    <Upload className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm">Drop screenshot here or click to upload</p>
                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  id="screenshot-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Submitting…' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
