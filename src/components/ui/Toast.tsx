'use client'

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'info'

type Toast = {
  id:       string
  message:  string
  variant:  ToastVariant
  duration: number
}

type ToastContextValue = {
  show:    (message: string, variant?: ToastVariant, duration?: number) => void
  success: (message: string, duration?: number) => void
  error:   (message: string, duration?: number) => void
  info:    (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      show:    () => {},
      success: () => {},
      error:   () => {},
      info:    () => {},
    }
  }
  return ctx
}

const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
  success: {
    icon:   CheckCircle2,
    color:  '#a7f3a7',
    bg:     'rgba(20, 50, 25, 0.85)',
    border: 'rgba(120, 200, 130, 0.45)',
  },
  error: {
    icon:   AlertCircle,
    color:  '#ffb4a3',
    bg:     'rgba(60, 18, 12, 0.85)',
    border: 'rgba(232, 75, 26, 0.55)',
  },
  info: {
    icon:   Info,
    color:  '#FAF0E8',
    bg:     'var(--bg-glass)',
    border: 'var(--border-strong)',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 5000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((list) => [...list, { id, message, variant, duration }])
    },
    [],
  )

  const value: ToastContextValue = {
    show,
    success: (m, d) => show(m, 'success', d),
    error:   (m, d) => show(m, 'error',   d),
    info:    (m, d) => show(m, 'info',    d),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed z-[1500] bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0
          flex flex-col items-end gap-2 pointer-events-none w-[calc(100vw-2.5rem)] max-w-sm"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const cfg = VARIANT_CONFIG[toast.variant]
  const Icon = cfg.icon

  useEffect(() => {
    if (toast.duration <= 0) return
    const timer = setTimeout(onClose, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onClose])

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="pointer-events-auto flex items-start gap-3 w-full px-4 py-3 rounded-xl shadow-lg backdrop-blur-md"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: 'var(--text-100)',
      }}
    >
      <Icon size={20} strokeWidth={2} color={cfg.color} className="mt-0.5 flex-shrink-0" />
      <p className="flex-1 text-sm leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        className="flex-shrink-0 -mr-1 -mt-1 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
        style={{ background: 'transparent', border: 0, color: 'var(--text-70)' }}
      >
        <X size={16} strokeWidth={2} />
      </button>
    </motion.div>
  )
}
