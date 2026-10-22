'use client'

import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { EMAIL, WHATSAPP_LINK, LINKEDIN_URL, GITHUB_URL } from '@/lib/constants'
import { LEGAL, legalIdentification } from '@/lib/legal'
import { requestConsentDialog } from '@/lib/consent'
import { Link } from '@/i18n/navigation'
import Newsletter from '@/components/ui/Newsletter'
import { WhatsAppIcon, LinkedInIcon, GitHubIcon } from '@/components/ui/BrandIcons'

export default function Footer() {
  const t = useTranslations('Footer')
  const locale = useLocale()
  const home = (hash: string) => (locale === 'pt' ? `/${hash}` : `/${locale}/${hash}`)

  const cols = [
    {
      title: t('colServices'),
      links: [
        { label: t('linkDevelopment'), href: home('#servicos') },
        { label: t('linkWebMobile'),   href: home('#servicos') },
        { label: t('linkArchitecture'), href: home('#servicos') },
        { label: t('linkIntegrations'), href: home('#servicos') },
        { label: t('linkConsulting'),  href: home('#servicos') },
      ],
    },
    {
      title: t('colCompany'),
      links: [
        { label: t('linkAbout'),       href: home('#sobre')    },
        { label: t('linkMethodology'), href: home('#processo') },
        { label: 'Insights',           href: '/insights' },
        { label: 'FAQ',                href: home('#faq')      },
        { label: t('colContact'),      href: home('#contato')  },
      ],
    },
    {
      title: t('colContact'),
      links: [
        { label: EMAIL,      href: `mailto:${EMAIL}` },
        { label: 'WhatsApp', href: WHATSAPP_LINK      },
        { label: 'LinkedIn', href: LINKEDIN_URL       },
        { label: 'GitHub',   href: GITHUB_URL         },
      ],
    },
  ]

  return (
    <footer className="pt-12 sm:pt-16 pb-8 border-t" style={{ background: 'var(--bg-1)', borderColor: 'var(--border)' }}>
      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <Newsletter />
        </div>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="min-[400px]:col-span-2 sm:col-span-2 lg:col-span-1">
            <a href={home('#hero')} className="flex items-center gap-2.5 no-underline mb-4 group w-fit">
              <Image
                src="/logo-mark.png"
                alt="Logotipo da H2V Systems"
                width={36}
                height={36}
                className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-sans font-semibold text-lg tracking-tight" style={{ color: 'var(--text-100)' }}>
                H<span style={{ color: 'var(--cyan)' }}>2</span>V
                <sub className="text-[0.6rem] ml-0.5" style={{ color: 'var(--text-70)', fontWeight: 400 }}>systems</sub>
              </span>
            </a>
            <p className="text-sm leading-[1.7] max-w-[280px] text-neutral-300">
              {t('brandDesc')}
            </p>
            <p className="text-xs leading-relaxed text-neutral-300 mt-3 max-w-[320px]">
              {legalIdentification(locale)}
            </p>
            <p className="text-xs text-neutral-300 mt-2">
              {LEGAL.email}
              {LEGAL.cnpj ? ` · CNPJ ${LEGAL.cnpj}` : ''}
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h5 className="text-xs font-semibold uppercase tracking-[0.12em] mb-4 text-neutral-300">
                {col.title}
              </h5>
              <ul className="flex flex-col gap-2.5 list-none">
                {col.links.map((l) => {
                  const external = l.href.startsWith('http') || l.href.startsWith('mailto:') || l.href.includes('#')
                  return (
                  <li key={l.label}>
                    {external ? (
                    <a href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm no-underline transition-colors duration-300 hover:text-[var(--cyan)] text-neutral-300">
                      {l.label}
                    </a>
                    ) : (
                    <Link href={l.href as '/insights'}
                      className="text-sm no-underline transition-colors duration-300 hover:text-[var(--cyan)] text-neutral-300">
                      {l.label}
                    </Link>
                    )}
                  </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <nav aria-label={t('legalNav')} className="border-t pt-5 mb-5 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs" style={{ borderColor: 'var(--border)' }}>
          <Link href="/legal/privacidade" className="text-neutral-300 hover:text-orange-400 no-underline">{t('linkPrivacy')}</Link>
          <Link href="/legal/termos" className="text-neutral-300 hover:text-orange-400 no-underline">{t('linkTerms')}</Link>
          <Link href="/legal/reembolso" className="text-neutral-300 hover:text-orange-400 no-underline">{t('linkRefund')}</Link>
          <button
            type="button"
            onClick={requestConsentDialog}
            className="bg-transparent border-0 p-0 text-xs text-neutral-300 hover:text-orange-400 cursor-pointer"
          >
            {t('linkCookies')}
          </button>
        </nav>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-neutral-300">
            {t('copyright').split('H2V Systems')[0]}
            <span style={{ color: 'var(--cyan)' }}>H2V Systems</span>
            {t('copyright').split('H2V Systems')[1]}
          </p>
          <div className="flex gap-2.5">
            {[
              { Icon: LinkedInIcon, href: LINKEDIN_URL,  title: 'LinkedIn'  },
              { Icon: GitHubIcon,   href: GITHUB_URL,    title: 'GitHub'    },
              { Icon: WhatsAppIcon, href: WHATSAPP_LINK, title: 'WhatsApp'  },
            ].map((s) => (
              <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title} aria-label={s.title}
                className="w-11 h-11 min-h-11 min-w-11 rounded-lg flex items-center justify-center no-underline transition-all duration-300 hover:-translate-y-0.5 group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <s.Icon size={15} color="var(--text-70)" className="transition-colors duration-300 group-hover:fill-[var(--cyan)]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
