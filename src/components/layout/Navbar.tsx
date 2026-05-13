'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

const LOCALE_FLAGS: Record<Locale, string> = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' }
const LOCALE_LABELS: Record<Locale, string> = { pt: 'PT', en: 'EN', es: 'ES' }

function LanguageSwitcher() {
  const locale   = useLocale() as Locale
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const switchTo = (next: Locale) => {
    router.replace(pathname, { locale: next })
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
          cursor-pointer bg-transparent border transition-all duration-300"
        style={{ borderColor: 'var(--border)', color: 'var(--text-70)' }}
        aria-label="Trocar idioma"
      >
        <span>{LOCALE_FLAGS[locale]}</span>
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
              border shadow-xl"
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              borderColor: 'var(--border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
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
                  background: loc === locale ? 'var(--cyan-dim)' : 'transparent',
                }}
              >
                <span>{LOCALE_FLAGS[loc]}</span>
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
          scrolled ? 'py-3' : 'py-5'
        }`}
        style={
          scrolled
            ? {
                background: 'rgba(13, 10, 8, 0.90)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border)',
                boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
              }
            : {}
        }
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 no-underline flex-shrink-0 group"
            aria-label="H2V Systems — Início"
          >
            <Image
              src="/logo.png"
              alt="H2V Systems logo"
              width={38}
              height={38}
              className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="font-mono font-bold text-lg tracking-tight" style={{ color: 'var(--text-100)' }}>
              H<span style={{ color: 'var(--cyan)' }}>2</span>V
              <sub className="text-[0.6rem] ml-0.5" style={{ color: 'var(--text-70)', fontWeight: 400 }}>systems</sub>
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
                  style={{ color: 'var(--text-70)' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-100)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-70)')
                  }
                >
                  {l.label}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-sm
                      group-hover:w-3/5 transition-all duration-300"
                    style={{ background: 'var(--cyan)' }}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Right: CTA + Language switcher */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white
                font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, var(--cyan), var(--blue))',
                boxShadow: '0 4px 24px rgba(232,75,26,0.45)',
              }}
            >
              {t('cta')}
            </a>
          </div>

          {/* Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex flex-col gap-[5px] p-2 bg-transparent border-0 cursor-pointer"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-6 h-0.5 rounded transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
                style={{ background: 'var(--text-100)' }}
              />
              <span
                className={`block w-6 h-0.5 rounded transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
                style={{ background: 'var(--text-100)' }}
              />
              <span
                className={`block w-6 h-0.5 rounded transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
                style={{ background: 'var(--text-100)' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6
          transition-opacity duration-300 md:hidden
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{
          background: 'rgba(13, 10, 8, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold no-underline transition-colors duration-300 hover:text-[var(--cyan)]"
            style={{ color: 'var(--text-100)' }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contato"
          onClick={() => setMenuOpen(false)}
          className="mt-4 px-8 py-4 rounded-lg text-white font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, var(--cyan), var(--blue))' }}
        >
          {t('cta')}
        </a>
      </div>
    </>
  )
}
