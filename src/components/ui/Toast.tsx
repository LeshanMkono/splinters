'use client'

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, duration?: number) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
  }, [])

  const toast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-4), { id, type, message, duration }])

    const timeout = setTimeout(() => remove(id), duration)
    timeoutRefs.current.set(id, timeout)
  }, [remove])

  const value: ToastContextValue = {
    toast,
    success: (msg) => toast('success', msg),
    error:   (msg) => toast('error', msg),
    info:    (msg) => toast('info', msg),
    warning: (msg) => toast('warning', msg),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error:   AlertCircle,
  info:    Info,
  warning: AlertTriangle,
}

const styles: Record<ToastType, string> = {
  success: 'border-l-4 border-green-500 bg-white',
  error:   'border-l-4 border-red-500 bg-white',
  info:    'border-l-4 border-navy bg-white',
  warning: 'border-l-4 border-orange bg-white',
}

const iconColors: Record<ToastType, string> = {
  success: 'text-green-500',
  error:   'text-red-500',
  info:    'text-navy',
  warning: 'text-orange',
}

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
    >
      {toasts.map(t => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              'toast-enter flex items-start gap-3 rounded-lg shadow-lg p-4',
              styles[t.type]
            )}
          >
            <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColors[t.type])} />
            <p className="flex-1 text-sm font-sans text-gray-800 leading-snug">{t.message}</p>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
