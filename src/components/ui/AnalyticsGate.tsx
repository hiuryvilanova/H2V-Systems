'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { CONSENT_EVENT, readConsent, type ConsentChoice } from '@/lib/consent'

/**
 * Carrega scripts de medição só depois do consentimento analítico.
 * Sem aceite, o site funciona normalmente — sem tracking.
 */
export default function AnalyticsGate() {
  const [consent, setConsent] = useState<ConsentChoice | null>(null)

  useEffect(() => {
    setConsent(readConsent())
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentChoice>).detail
      setConsent(detail ?? readConsent())
    }
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  if (!consent?.analytics) return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
