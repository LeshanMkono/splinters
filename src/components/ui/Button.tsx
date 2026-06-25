import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:   'bg-orange text-white hover:bg-orange-dark border-2 border-transparent',
  secondary: 'bg-navy text-white hover:bg-navy-light border-2 border-transparent',
  ghost:     'bg-transparent text-navy border-2 border-navy hover:bg-navy hover:text-white',
  danger:    'bg-red-600 text-white hover:bg-red-700 border-2 border-transparent',
  success:   'bg-green-600 text-white hover:bg-green-700 border-2 border-transparent',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

interface BaseProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  loading?: boolean
  disabled?: boolean
}

interface ButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined
}

interface LinkProps extends BaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> {
  href: string
}

type Props = ButtonProps | LinkProps

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded font-sans font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 cursor-pointer'

export function Button({ variant = 'primary', size = 'md', className, children, loading, disabled, href, ...rest }: Props) {
  const classes = cn(baseClasses, variants[variant], sizes[size], className)

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </>
  )

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  )
}
