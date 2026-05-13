'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { EMAIL, WHATSAPP_LINK, LINKEDIN_URL, GITHUB_URL } from '@/lib/constants'
import Newsletter from '@/components/ui/Newsletter'
import { WhatsAppIcon, LinkedInIcon, GitHubIcon } from '@/components/ui/BrandIcons'

export default function Footer() {
  const t = useTranslations('Footer')

  const cols = [
    {
      title: t('colServices'),
      links: [
        { label: t('linkDevelopment'), href: '#servicos' },
        { label: t('linkWebMobile'),   href: '#servicos' },
        { label: t('linkArchitecture'), href: '#servicos' },
        { label: t('linkIntegrations'), href: '#servicos' },
        { label: t('linkConsulting'),  href: '#servicos' },
      ],
    },
    {
      title: t('colCompany'),
      links: [
        { label: t('linkAbout'),       href: '#sobre'    },
        { label: t('linkMethodology'), href: '#processo' },
        { label: 'Insights',           href: '/insights' },
        { label: 'FAQ',                href: '#faq'      },
        { label: t('colContact'),      href: '#contato'  },
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
    <footer className="pt-12 sm:pt-16 pb-8 border-t" style={{ background: 'var(--bg-0)', borderColor: 'var(--border)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <Newsletter />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="flex items-center gap-2.5 no-underline mb-4 group w-fit">
              <Image
                src="/logo.png"
                alt="H2V Systems logo"
                width={36}
                height={36}
                className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-mono font-bold text-lg tracking-tight" style={{ color: 'var(--text-100)' }}>
                H<span style={{ color: 'var(--cyan)' }}>2</span>V
                <sub className="text-[0.6rem] ml-0.5" style={{ color: 'var(--text-70)', fontWeight: 400 }}>systems</sub>
              </span>
            </a>
            <p className="text-sm leading-[1.7] max-w-[280px]" style={{ color: 'var(--text-70)' }}>
              {t('brandDesc')}
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h5 className="text-xs font-semibold uppercase tracking-[0.1em] mb-4 font-mono" style={{ color: 'var(--text-70)' }}>
                {col.title}
              </h5>
              <ul className="flex flex-col gap-2.5 list-none">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm no-underline transition-colors duration-300 hover:text-[var(--cyan)]"
                      style={{ color: 'var(--text-70)' }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-40)' }}>
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
                className="w-9 h-9 rounded-lg flex items-center justify-center no-underline transition-all duration-300 hover:-translate-y-0.5 group"
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
