import type { Locale } from '@/i18n/routing'
import { BR, ES, US } from 'country-flag-icons/react/3x2'

const FLAG: Record<Locale, typeof BR> = {
  pt: BR,
  en: US,
  es: ES,
}

/** Bandeira do país associado ao idioma (SVG, renderização consistente em todos os SO). */
export default function LocaleFlag({
  locale,
  className = 'h-4 w-6 shrink-0 rounded-[2px] shadow-sm',
}: {
  locale: Locale
  className?: string
}) {
  const Cmp = FLAG[locale]
  return <Cmp className={className} aria-hidden />
}
