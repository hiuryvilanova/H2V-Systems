'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Newsletter() {
  const t = useTranslations('Newsletter')
  const toast = useToast()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_REGEX.test(email)) {
      toast.error(t('errorEmail'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        toast.error(t('errorServer'))
        setLoading(false)
        return
      }
      toast.success(t('success'))
      setLoading(false)
      setDone(true)
    } catch {
      toast.error(t('errorServer'))
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border)' }}>
          <Mail size={16} strokeWidth={1.75} color="var(--cyan)" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold mb-1">{t('title')}</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-70)' }}>{t('description')}</p>
        </div>
      </div>

      {done ? (
        <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--cyan)' }}>
          <CheckCircle2 size={18} strokeWidth={1.75} />
          {t('success')}
        </div>
      ) : (
        <form onSubmit={submit} className="mt-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              style={{
                background: 'var(--bg-0)', border: '1px solid var(--border)', borderRadius: '8px',
                color: 'var(--text-100)', padding: '10px 14px', fontSize: '14px',
                outline: 'none', flex: 1, fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--cyan)' }}
              onBlur={(e)  => { e.target.style.borderColor = 'var(--border)' }}
            />
            <button
              type="submit" disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-11 rounded-lg text-white font-semibold text-sm cursor-pointer border-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto shrink-0"
              style={{ background: 'var(--cyan)', boxShadow: '0 8px 24px rgba(194,65,12,0.2)' }}
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
