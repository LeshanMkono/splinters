import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { MembersTab } from '@/components/admin/MembersTab'
import { PaymentsTab } from '@/components/admin/PaymentsTab'
import { PollsTab } from '@/components/admin/PollsTab'
import { SOCMonitor } from '@/components/admin/SOCMonitor'
import { AdminTabsClient } from './AdminTabsClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')
  if (session.user.role !== 'admin') redirect('/dashboard')

  const supabase = createServerClient()

  const [membersRes, paymentsRes, pollsRes, eventsRes, loginsRes, honeypotRes, userRes] =
    await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase
        .from('payments')
        .select('*, user:users(id, email, nickname, full_name)')
        .order('created_at', { ascending: false }),
      supabase.from('polls').select('*').order('poll_date', { ascending: false }),
      supabase.from('soc_events').select('*').order('occurred_at', { ascending: false }).limit(200),
      supabase
        .from('login_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('honeypot_hits')
        .select('*')
        .order('hit_at', { ascending: false })
        .limit(100),
      supabase.from('users').select('*').eq('id', session.user.id).single(),
    ])

  const adminUser = userRes.data

  return (
    <>
      <DashboardNav user={adminUser} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="text-xs font-mono text-mid uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="font-display text-4xl text-navy">CONTROL CENTRE</h1>
        </div>

        <AdminTabsClient
          members={membersRes.data ?? []}
          payments={paymentsRes.data ?? []}
          polls={pollsRes.data ?? []}
          events={eventsRes.data ?? []}
          loginAttempts={loginsRes.data ?? []}
          honeypotHits={honeypotRes.data ?? []}
        />
      </main>
    </>
  )
}
