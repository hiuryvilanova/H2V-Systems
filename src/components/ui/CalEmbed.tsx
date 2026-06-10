'use client'

import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { Calendar } from 'lucide-react'

type Props = {
  /** Cal.com link, sem o domínio. Ex.: "hiuryvilanova" ou "hiuryvilanova/30min". */
  calLink: string
  /** Pré-preenche o booking quando o usuário já digitou no formulário. */
  prefill?: { name?: string; email?: string; notes?: string }
  /** Disparado quando o agendamento é concluído com sucesso (postMessage do Cal). */
  onBookingSuccessful?: (payload: unknown) => void
  /** Locale para o Cal.com (pt-BR, en, es). */
  locale?: string
  className?: string
  /** Altura mínima do embed. */
  minHeight?: string
}

/**
 * Wrapper oficial do Cal.com embed.
 *
 * Vantagens sobre iframe direto:
 * - Prefill confiável (name, email, notes) em qualquer booking page.
 * - Tema dark integrado ao site.
 * - Callback `bookingSuccessful` via postMessage — permite confirmar o
 *   agendamento na nossa própria UI.
 * - Carregamento progressivo (skeleton até o widget estar pronto).
 */
export default function CalEmbed({
  calLink,
  prefill,
  onBookingSuccessful,
  locale = 'pt-BR',
  className = '',
  minHeight = 'clamp(560px, 72vh, 760px)',
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const namespace = 'h2v-contact'

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const cal = await getCalApi({ namespace })
        if (cancelled) return

        cal('ui', {
          theme: 'dark',
          cssVarsPerTheme: {
            light: { 'cal-brand': '#ea580c' },
            dark:  { 'cal-brand': '#ea580c' },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        })

        // Eventos do Cal.com via postMessage
        cal('on', {
          action: 'linkReady',
          callback: () => {
            if (!cancelled) setLoaded(true)
          },
        })

        if (onBookingSuccessful) {
          cal('on', {
            action: 'bookingSuccessful',
            callback: (e) => {
              if (!cancelled) onBookingSuccessful(e?.detail ?? e)
            },
          })
        }
      } catch {
        // Falha silenciosa — o fallback (botão "abrir em nova aba") cobre.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [onBookingSuccessful])

  return (
    <div className={`relative ${className}`} style={{ minHeight }}>
      {/* Skeleton enquanto o Cal não confirma "linkReady" */}
      {!loaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-neutral-950 border border-neutral-800 z-10"
          aria-hidden="true"
        >
          <Calendar size={28} className="text-orange-500/70 animate-pulse" />
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Carregando agenda...
          </span>
        </div>
      )}

      <Cal
        namespace={namespace}
        calLink={calLink}
        style={{ width: '100%', height: '100%', minHeight, overflow: 'hidden' }}
        config={{
          layout: 'month_view',
          theme: 'dark',
          'utm_source':   'h2vsystems',
          'utm_medium':   'website',
          'utm_campaign': 'contact_section',
          ...(locale ? { language: locale } : {}),
          ...(prefill?.name  ? { name:  prefill.name  } : {}),
          ...(prefill?.email ? { email: prefill.email } : {}),
          ...(prefill?.notes ? { notes: prefill.notes } : {}),
        }}
      />
    </div>
  )
}
