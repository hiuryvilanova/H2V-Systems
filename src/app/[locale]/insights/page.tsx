import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Calendar, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgressBar from '@/components/ui/ProgressBar'
import BackToTop from '@/components/ui/BackToTop'
import { getAllInsights } from '@/lib/insights'

const SITE_URL = 'https://www.h2vsystems.com.br'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Insights' })
  const localePath = locale === 'pt' ? '' : `/${locale}`
  const canonical = `${SITE_URL}${localePath}/insights`

  const ogImagePath = `/${locale}/opengraph-image`

  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical,
      languages: {
        'pt-BR':     `${SITE_URL}/insights`,
        'en-US':     `${SITE_URL}/en/insights`,
        'es-ES':     `${SITE_URL}/es/insights`,
        'x-default': `${SITE_URL}/insights`,
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDesc'),
      url: canonical,
      siteName: 'H2V Systems',
      type: 'website',
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

export default async function InsightsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Insights' })
  const insights = getAllInsights(locale)

  const localePath = locale === 'pt' ? '' : `/${locale}`

  const dateFmt = new Intl.DateTimeFormat(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'short', day: '2-digit' },
  )

  return (
    <>
      <ProgressBar />
      <Navbar />

      <main id="main" tabIndex={-1} className="w-full min-w-0">
        <section className="relative pt-[120px] sm:pt-[150px] pb-12 sm:pb-16 overflow-hidden bg-white">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(194,65,12,0.06) 0%, transparent 60%)' }} />

          <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
            <span className="tag-badge">
              {t('tag')}
            </span>
            <h1 className="text-[clamp(1.9rem,5.5vw,3.4rem)] font-bold tracking-tight leading-[1.1] mb-4 max-w-[800px]">
              {t('title')}
              <br />
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h1>
            <p className="text-base sm:text-lg leading-[1.7] max-w-[680px]" style={{ color: 'var(--text-70)' }}>
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6">
            {insights.length === 0 ? (
              <p className="text-center text-sm py-16" style={{ color: 'var(--text-70)' }}>{t('empty')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {insights.map((post) => (
                  <Link
                    key={post.slug}
                    href={`${localePath}/insights/${post.slug}` as never}
                    className="group glass-card rounded-3xl p-6 sm:p-8 no-underline block transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--text-70)' }}>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} strokeWidth={1.75} />
                        <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} strokeWidth={1.75} />
                        {post.readingTime} {t('readingTime')}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold mb-3 leading-tight transition-colors group-hover:text-[var(--cyan)]"
                      style={{ color: 'var(--text-100)' }}>
                      {post.title}
                    </h2>
                    <p className="text-sm leading-[1.65] mb-4" style={{ color: 'var(--text-70)' }}>
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {post.tags.slice(0, 3).map((tag) => <span key={tag} className="service-tag">{tag}</span>)}
                    </div>
                    <span className="inline-flex items-center text-sm font-semibold" style={{ color: 'var(--cyan)' }}>
                      {t('readMore')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </>
  )
}
