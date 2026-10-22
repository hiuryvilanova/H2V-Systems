'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Cookie } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { readConsent, writeConsent } from '@/lib/consent'

export default function CookieBanner() {
  const t = useTranslations('Cookies')
  const [visible, setVisible] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const existing = readConsent()
    let timer: number | undefined
    if (!existing) {
      timer = window.setTimeout(() => setVisible(true), 400)
    }

    const onOpen = () => setVisible(true)
    window.addEventListener('h2v-consent-open', onOpen)
    return () => {
      if (timer) window.clearTimeout(timer)
      window.removeEventListener('h2v-consent-open', onOpen)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    const first = dialogRef.current?.querySelector<HTMLElement>('button, a')
    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        choose(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [visible])

  const choose = (analytics: boolean) => {
    writeConsent(analytics)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed z-[9997] rounded-2xl p-5 sm:p-6 animate-fade-in max-w-md cookie-banner-pos"
      style={{
        background: 'rgba(18, 18, 20, 0.98)',
        border: '1px solid var(--border-strong)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border)' }}>
          <Cookie size={18} strokeWidth={1.75} color="var(--cyan)" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 id="cookie-title" className="text-sm font-bold mb-1 text-white">{t('title')}</h3>
          <p id="cookie-desc" className="text-xs leading-relaxed text-neutral-300">
            {t('description')}
          </p>
          <p className="mt-2 text-xs leading-relaxed">
            <Link href="/legal/privacidade" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
              {t('privacyLink')}
            </Link>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          type="button"
          onClick={() => choose(false)}
          className="flex-1 px-4 py-3 min-h-11 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-white/[0.03] text-neutral-200"
          style={{ background: 'transparent', border: '1px solid var(--border-strong)' }}
        >
          {t('reject')}
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="flex-1 px-4 py-3 min-h-11 rounded-lg text-sm font-semibold text-white cursor-pointer border-0 transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'var(--cyan)', boxShadow: '0 8px 24px rgba(234,88,12,0.2)' }}
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}
