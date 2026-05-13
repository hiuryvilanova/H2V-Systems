'use client'

import { useTranslations } from 'next-intl'

export default function SkipToContent() {
  const t = useTranslations('A11y')
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[2000]
        focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:no-underline
        focus:outline-none"
      style={{
        background: 'var(--cyan)',
        color: '#fff',
        boxShadow: '0 4px 24px rgba(232,75,26,0.55)',
      }}
    >
      {t('skipToContent')}
    </a>
  )
}
