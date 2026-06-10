'use client'

import { usePathname } from 'next/navigation'

/**
 * Transição de página puramente opacidade (sem `transform`).
 * Importante: NÃO usar `transform`, `will-change: transform`, `filter`,
 * `backdrop-filter` ou `perspective` aqui — qualquer um deles cria
 * um containing block que quebra `position: fixed` da Navbar e dos
 * botões flutuantes (WhatsApp, BackToTop, Cookie, Toast).
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
