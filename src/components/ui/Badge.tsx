import { cn } from '@/lib/utils'
import type { MembershipStatus, PaymentStatus, UserRole } from '@/types'

type BadgeVariant =
  | 'active'
  | 'pending'
  | 'suspended'
  | 'guest'
  | 'confirmed'
  | 'rejected'
  | 'admin'
  | 'premium'
  | 'exclusive'

const variantClasses: Record<BadgeVariant, string> = {
  active:    'badge badge-active',
  pending:   'badge badge-pending',
  suspended: 'badge badge-suspended',
  guest:     'badge badge-guest',
  confirmed: 'badge badge-confirmed',
  rejected:  'badge badge-rejected',
  admin:     'badge bg-navy text-white',
  premium:   'badge bg-orange text-white',
  exclusive: 'badge bg-purple-600 text-white',
}

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  )
}

// ── Convenience helpers ────────────────────────────────────────────────────────

export function MembershipBadge({ status }: { status: MembershipStatus }) {
  const labels: Record<MembershipStatus, string> = {
    active:          'Active',
    pending_payment: 'Pending',
    suspended:       'Suspended',
    guest:           'Guest',
  }
  const variants: Record<MembershipStatus, BadgeVariant> = {
    active:          'active',
    pending_payment: 'pending',
    suspended:       'suspended',
    guest:           'guest',
  }
  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const labels: Record<PaymentStatus, string> = {
    pending:   'Pending',
    confirmed: 'Confirmed',
    rejected:  'Rejected',
  }
  const variants: Record<PaymentStatus, BadgeVariant> = {
    pending:   'pending',
    confirmed: 'confirmed',
    rejected:  'rejected',
  }
  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

export function RoleBadge({ role }: { role: UserRole }) {
  const labels: Record<UserRole, string> = {
    admin:     'Admin',
    premium:   'Premium',
    exclusive: 'Exclusive',
    guest:     'Guest',
  }
  const variants: Record<UserRole, BadgeVariant> = {
    admin:     'admin',
    premium:   'premium',
    exclusive: 'exclusive',
    guest:     'guest',
  }
  return <Badge variant={variants[role]}>{labels[role]}</Badge>
}
