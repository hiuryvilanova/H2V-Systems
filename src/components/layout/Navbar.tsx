'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import LocaleFlag from '@/components/ui/LocaleFlag'

const LOCALE_LABELS: Record<Locale, string> = { pt: 'PT', en: 'EN', es: 'ES' }

function LanguageSwitcher({ onOrange }: { onOrange?: boolean }) {
  const locale   = useLocale() as Locale
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const switchTo = (next: Locale) => {
    router.replace(pathname, { locale: next })
    setOpen(false)
  }

  const btnBorder = onOrange ? 'rgba(255,255,255,0.38)' : 'var(--border)'
  const btnColor  = onOrange ? 'rgba(255,255,255,0.95)' : 'var(--text-70)'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium
          cursor-pointer bg-transparent border transition-all duration-300"
        style={{ borderColor: btnBorder, color: btnColor }}
        aria-label="Trocar idioma"
      >
        <LocaleFlag
          locale={locale}
          className={onOrange ? 'h-4 w-6 shrink-0 rounded-[2px] ring-1 ring-white/35 shadow-sm' : undefined}
        />
        <span>{LOCALE_LABELS[locale]}</span>
        <span
          className="text-xs transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden min-w-[120px]
              border shadow-2xl"
            style={{
              background: 'rgba(18, 18, 20, 0.95)',
              borderColor: 'var(--border)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          >
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchTo(loc)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium
                  cursor-pointer bg-transparent border-0 text-left transition-colors duration-200"
                style={{
                  color: loc === locale ? 'var(--cyan)' : 'var(--text-70)',
                  background: loc === locale ? 'rgba(234, 88, 12, 0.12)' : 'transparent',
                }}
              >
                <LocaleFlag locale={loc} />
                <span>{LOCALE_LABELS[loc]}</span>
                {loc === locale && (
                  <span className="ml-auto text-xs" style={{ color: 'var(--cyan)' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Navbar() {
  const t = useTranslations('Nav')
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  const NAV_LINKS = [
    { href: '#servicos',  label: t('services') },
    { href: '#cases',     label: t('cases')    },
    { href: '#sobre',     label: t('about')    },
    { href: '#processo',  label: t('process')  },
    { href: '#faq',       label: 'FAQ'         },
    { href: '#contato',   label: t('contact')  },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled ? 'pb-3' : 'pb-5'
        }`}
        style={{
          paddingTop: scrolled
            ? 'max(0.75rem, env(safe-area-inset-top, 0px))'
            : 'max(1.25rem, env(safe-area-inset-top, 0px))',
          background: scrolled
            ? 'rgba(10, 10, 10, 0.82)'
            : 'rgba(10, 10, 10, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(255, 255, 255, 0.02)',
          boxShadow: scrolled
            ? '0 10px 30px rgba(0, 0, 0, 0.4)'
            : 'none',
        }}
      >
        <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2 sm:gap-2.5 no-underline flex-shrink-0 min-w-0 group"
            aria-label="H2V Systems — Início"
          >
            <Image
              src="/logo.png"
              alt="H2V Systems logo"
              width={38}
              height={38}
              className="rounded-lg transition-transform duration-300 group-hover:scale-105 shrink-0"
              priority
            />
            <span className="font-sans font-semibold text-base sm:text-lg tracking-tight truncate" style={{ color: '#fafaf9' }}>
              H<span style={{ color: 'rgba(255,255,255,0.88)' }}>2</span>V
              <sub className="hidden min-[420px]:inline text-[0.6rem] ml-0.5 align-baseline" style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 400 }}>systems</sub>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 list-none flex-1 justify-center">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium no-underline
                    transition-colors duration-300 group"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = '#ffffff')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.9)')
                  }
                >
                  {l.label}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-sm
                      group-hover:w-3/5 transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.85)' }}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Right: CTA + Language switcher */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher onOrange />
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
              style={{
                background: '#fafaf9',
                color: '#7c2d12',
                boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
              }}
            >
              {t('cta')}
            </a>
          </div>

          {/* Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher onOrange />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex flex-col items-center justify-center gap-[5px] min-h-11 min-w-11 p-2 bg-transparent border-0 cursor-pointer rounded-lg"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-6 h-0.5 rounded transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
                style={{ background: '#fffef9' }}
              />
              <span
                className={`block w-6 h-0.5 rounded transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
                style={{ background: '#fffef9' }}
              />
              <span
                className={`block w-6 h-0.5 rounded transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
                style={{ background: '#fffef9' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 sm:gap-6
          transition-opacity duration-300 md:hidden overflow-y-auto overscroll-y-contain px-6
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{
          background: 'rgba(10, 10, 10, 0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          paddingTop: 'max(2rem, env(safe-area-inset-top))',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        }}
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="text-center text-[clamp(1.15rem,4.5vw,1.5rem)] font-bold no-underline transition-colors duration-300 py-1"
            style={{ color: '#fafaf9' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cyan)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#fafaf9' }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contato"
          onClick={() => setMenuOpen(false)}
          className="mt-2 min-h-12 px-8 py-3.5 rounded-lg font-semibold no-underline text-white inline-flex items-center justify-center text-center"
          style={{ background: 'var(--cyan)', boxShadow: '0 8px 28px rgba(234,88,12,0.25)' }}
        >
          {t('cta')}
        </a>
      </div>
    </>
  )
}
