import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgressBar from '@/components/ui/ProgressBar'
import BackToTop from '@/components/ui/BackToTop'
import { getAllInsightFiles, getInsightBySlug } from '@/lib/insights'

const SITE_URL = 'https://www.h2vsystems.com.br'

type PageParams = { locale: string; slug: string }

export function generateStaticParams() {
  const files = getAllInsightFiles()
  const slugs = new Set<string>()
  for (const f of files) {
    slugs.add(f.replace(/\.(md|mdx)$/, '').replace(/\.(pt|en|es)$/, ''))
  }
  const all: PageParams[] = []
  for (const slug of slugs) {
    for (const locale of ['pt', 'en', 'es']) {
      all.push({ locale, slug })
    }
  }
  return all
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getInsightBySlug(slug, locale)
  if (!post) return {}

  const localePath = locale === 'pt' ? '' : `/${locale}`
  const url = `${SITE_URL}${localePath}/insights/${slug}`

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      siteName: 'H2V Systems',
      authors: [post.author],
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function InsightPost({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params
  const post = getInsightBySlug(slug, locale)
  if (!post) notFound()

  const t = await getTranslations({ locale, namespace: 'Insights' })
  const localePath = locale === 'pt' ? '' : `/${locale}`

  const dateFmt = new Intl.DateTimeFormat(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: '2-digit' },
  )

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://hiuryvilanova.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'H2V Systems',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: `${SITE_URL}${localePath}/insights/${slug}`,
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <ProgressBar />
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <main id="main" tabIndex={-1}>
        <article className="relative pt-[120px] sm:pt-[150px] pb-16 sm:pb-24">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none top-0 h-[400px]"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,75,26,0.10) 0%, transparent 70%)' }} />

          <div className="max-w-[760px] mx-auto px-5 sm:px-6 relative z-10">
            <Link href={`${localePath}/insights` as never}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm mb-6 sm:mb-8 no-underline transition-colors"
              style={{ color: 'var(--text-70)' }}>
              <ArrowLeft size={14} strokeWidth={2} />
              {t('back')}
            </Link>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {post.tags.map((tag) => <span key={tag} className="service-tag">{tag}</span>)}
            </div>

            <h1 className="text-[clamp(1.7rem,5vw,3rem)] font-black tracking-tight leading-[1.15] mb-5">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg leading-[1.65] mb-6" style={{ color: 'var(--text-70)' }}>
              {post.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pb-8 mb-10 border-b" style={{ color: 'var(--text-70)', borderColor: 'var(--border)' }}>
              <span className="inline-flex items-center gap-1.5">
                <User size={13} strokeWidth={1.75} />
                {t('by')} <strong style={{ color: 'var(--text-100)' }}>{post.author}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} strokeWidth={1.75} />
                <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} strokeWidth={1.75} />
                {post.readingTime} {t('readingTime')}
              </span>
            </div>

            <div className="insight-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </article>
      </main>

      <Footer />
      <BackToTop />
    </>
  )
}
