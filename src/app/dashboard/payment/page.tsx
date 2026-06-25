import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function DashboardPaymentPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const supabase = createServerClient()
  const { data: user } = await supabase.from('users').select('*').eq('id', session.user.id).single()
  if (!user) redirect('/auth/login')

  return (
    <>
      <DashboardNav user={user} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-mid hover:text-navy text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <h1 className="font-display text-3xl text-navy mb-6">PAY MEMBERSHIP</h1>

        {/* Redirect to payment page */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-mid mb-4">Submit your M-Pesa payment details below.</p>
          <Link
            href="/auth/payment"
            className="inline-flex px-6 py-3 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark transition-colors"
          >
            Submit Payment →
          </Link>
        </div>
      </main>
    </>
  )
}
