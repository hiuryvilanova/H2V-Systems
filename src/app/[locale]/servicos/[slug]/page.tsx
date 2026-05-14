import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgressBar from '@/components/ui/ProgressBar'
import BackToTop from '@/components/ui/BackToTop'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'
import { SERVICES, SERVICE_SLUGS, type ServiceSlug } from '@/lib/services-data'

const SITE_URL = 'https://www.h2vsystems.com.br'

type PageParams = { locale: string; slug: string }

export function generateStaticParams() {
  return SERVICE_SLUGS.flatMap((slug) =>
    ['pt', 'en', 'es'].map((locale) => ({ locale, slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidSlug(slug)) return {}

  const t = await getTranslations({ locale, namespace: `Services_${slug}` })
  const localePath = locale === 'pt' ? '' : `/${locale}`
  const canonical = `${SITE_URL}${localePath}/servicos/${slug}`

  const ogImagePath = `/${locale}/opengraph-image`

  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical,
      languages: {
        'pt-BR':     `${SITE_URL}/servicos/${slug}`,
        'en-US':     `${SITE_URL}/en/servicos/${slug}`,
        'es-ES':     `${SITE_URL}/es/servicos/${slug}`,
        'x-default': `${SITE_URL}/servicos/${slug}`,
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDesc'),
      url: canonical,
      siteName: 'H2V Systems',
      type: 'article',
      images: [{ url: ogImagePath, width: 1200, height: 630, alt: 'H2V Systems' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDesc'),
      images: [ogImagePath],
    },
  }
}

function isValidSlug(slug: string): slug is ServiceSlug {
  return SERVICE_SLUGS.includes(slug as ServiceSlug)
}

export default async function ServicePage({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params
  if (!isValidSlug(slug)) notFound()

  const service = SERVICES[slug]
  const Icon = service.icon
  const t = await getTranslations({ locale, namespace: `Services_${slug}` })
  const tShared = await getTranslations({ locale, namespace: 'ServicePage' })

  const benefits = t.raw('benefits') as string[]
  const faqItems = t.raw('faq')      as Array<{ q: string; a: string }>

  const localePath = locale === 'pt' ? '' : `/${locale}`
  const pageUrl = `${SITE_URL}${localePath}/servicos/${slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tShared('breadcrumbHome'),     item: `${SITE_URL}${localePath}` },
      { '@type': 'ListItem', position: 2, name: tShared('breadcrumbServices'), item: `${SITE_URL}${localePath}/#servicos` },
      { '@type': 'ListItem', position: 3, name: t('title'),                     item: pageUrl },
    ],
  }

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('metaTitle'),
    description: t('metaDesc'),
    provider: { '@type': 'Organization', name: 'H2V Systems', url: SITE_URL },
    areaServed: ['BR', 'US', 'ES'],
    url: pageUrl,
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return (
    <>
      <ProgressBar />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <main id="main" tabIndex={-1} className="w-full min-w-0">
        {/* Hero */}
        <section className="relative pt-[120px] sm:pt-[140px] pb-12 sm:pb-16 overflow-hidden bg-white">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(194,65,12,0.06) 0%, transparent 60%)' }} />

          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs mb-6 sm:mb-8" style={{ color: 'var(--text-70)' }}>
              <Link href={`${localePath}/` as never} className="hover:text-[var(--cyan)] transition-colors">
                {tShared('breadcrumbHome')}
              </Link>
              <span className="select-none opacity-40" aria-hidden="true">/</span>
              <Link href={`${localePath}/#servicos` as never} className="hover:text-[var(--cyan)] transition-colors">
                {tShared('breadcrumbServices')}
              </Link>
              <span className="select-none opacity-40" aria-hidden="true">/</span>
              <span style={{ color: 'var(--text-100)' }}>{t('title')}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border-strong)' }}>
                <Icon size={28} strokeWidth={1.75} color="var(--cyan)" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-[clamp(1.9rem,5.5vw,3.4rem)] font-bold tracking-tight leading-[1.1] mb-5 sm:mb-6 max-w-[800px]">
                  {t('title')}
                  <br />
                  <span className="gradient-text">{t('titleHighlight')}</span>
                </h1>

                <p className="text-base sm:text-lg leading-[1.7] mb-8 max-w-[680px]" style={{ color: 'var(--text-70)' }}>
                  {t('subtitle')}
                </p>

                <Link href={`${localePath}/#contato` as never}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
                  style={{ background: 'var(--cyan)', boxShadow: '0 8px 28px rgba(194,65,12,0.2)' }}>
                  {tShared('ctaButton')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Intro + Benefits */}
        <section className="py-12 sm:py-16 relative">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <p className="text-sm sm:text-base leading-[1.85]" style={{ color: 'var(--text-70)' }}>
                  {t('intro')}
                </p>
              </div>

              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold mb-5">{tShared('benefitsTitle')}</h2>
                <ul className="flex flex-col gap-3 list-none p-0">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm leading-[1.6]">
                      <CheckCircle2 size={18} strokeWidth={2} color="var(--cyan)" className="flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="py-10 sm:py-14 relative">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] mb-5" style={{ color: 'var(--cyan)' }}>
              {tShared('stackTitle')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {service.stack.map((tag) => (
                <span key={tag} className="service-tag">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-20 relative">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
            <h2 className="text-[clamp(1.4rem,3.5vw,2rem)] font-bold tracking-tight mb-8 max-w-[860px]">
              <span className="gradient-text">{tShared('faqTitle')}</span>
            </h2>
            <div className="flex flex-col gap-3 max-w-[860px]">
              {faqItems.map((it) => (
                <details key={it.q}
                  className="group glass-card rounded-2xl px-5 py-4 sm:px-6 sm:py-5 cursor-pointer
                    transition-all duration-300 hover:border-[var(--border-strong)]">
                  <summary className="list-none flex items-center justify-between gap-4 font-semibold text-sm sm:text-base cursor-pointer">
                    <span className="flex-1 pr-2">{it.q}</span>
                    <span
                      className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center text-xl font-light transition-transform duration-300 flex-shrink-0 group-open:rotate-45"
                      style={{ background: 'var(--cyan-dim)', color: 'var(--cyan)', border: '1px solid var(--border)' }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-[1.7]" style={{ color: 'var(--text-70)' }}>{it.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(194,65,12,0.06) 0%, transparent 70%)' }} />
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 text-center relative z-10">
            <h2 className="text-[clamp(1.6rem,4.5vw,2.4rem)] font-bold tracking-tight mb-4">
              {tShared('ctaTitle')}
            </h2>
            <p className="text-base mb-8 max-w-[560px] mx-auto" style={{ color: 'var(--text-70)' }}>
              {tShared('ctaDesc')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={`${localePath}/#contato` as never}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-white font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: 'var(--cyan)', boxShadow: '0 8px 28px rgba(194,65,12,0.2)' }}>
                {tShared('ctaButton')}
              </Link>
              <Link href={`${localePath}/` as never}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
                style={{ color: 'var(--cyan)', border: '1px solid var(--border-strong)' }}>
                {tShared('breadcrumbHome')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
      <WhatsAppFloat />
    </>
  )
}
