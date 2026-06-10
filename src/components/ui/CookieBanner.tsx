'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Cookie, X } from 'lucide-react'

const STORAGE_KEY = 'h2v_cookie_consent_v1'

export default function CookieBanner() {
  const t = useTranslations('Cookies')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        const timer = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(timer)
      }
    } catch {
    }
  }, [])

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch {}
    setVisible(false)
  }

  const reject = () => {
    try { localStorage.setItem(STORAGE_KEY, 'rejected') } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('aria')}
      className="fixed z-[9997] rounded-2xl p-5 sm:p-6 animate-fade-in max-w-md cookie-banner-pos"
      style={{
        background: 'rgba(18, 18, 20, 0.96)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <button
        onClick={reject}
        aria-label={t('close')}
        className="absolute top-2 right-2 min-h-11 min-w-11 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-white/[0.04]"
        style={{ color: 'var(--text-70)' }}
      >
        <X size={16} strokeWidth={2} />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border)' }}>
          <Cookie size={18} strokeWidth={1.75} color="var(--cyan)" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold mb-1 text-white">{t('title')}</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-70)' }}>
            {t('description')}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={reject}
          className="flex-1 px-4 py-3 min-h-11 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-white/[0.03]"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-70)' }}
        >
          {t('reject')}
        </button>
        <button
          onClick={accept}
          className="flex-1 px-4 py-3 min-h-11 rounded-lg text-sm font-semibold text-white cursor-pointer border-0 transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'var(--cyan)', boxShadow: '0 8px 24px rgba(234,88,12,0.2)' }}
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}
