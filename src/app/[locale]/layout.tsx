import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { routing } from '@/i18n/routing'
import { ToastProvider } from '@/components/ui/Toast'
import SkipToContent from '@/components/ui/SkipToContent'
import '../globals.css'

const SITE_URL = 'https://www.h2vsystems.com.br'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E84B1A',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'

  /** Imagem OG por idioma (arquivo `opengraph-image.tsx` em `[locale]`). */
  const ogImagePath = `/${locale}/opengraph-image`

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s | H2V Systems`,
    },
    description: t('description'),
    keywords: ['desenvolvimento de software', 'software house', 'sistemas web', 'aplicativos mobile', 'consultoria técnica', 'arquitetura de software', 'H2V Systems'],
    authors: [{ name: 'Hiury Vilanova', url: SITE_URL }],
    creator: 'Hiury Vilanova',
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    /**
     * Favicon na aba + favicon nos resultados do Google (mínimo recomendado 48×48).
     * favicon.ico na raiz + PNG para retina e Apple.
     */
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
        { url: '/logo.png', type: 'image/png', sizes: '32x32' },
        { url: '/logo.png', type: 'image/png', sizes: '192x192' },
      ],
      shortcut: '/favicon.ico',
      apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: SITE_URL,
      siteName: 'H2V Systems',
      locale: ogLocale,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: 'H2V Systems',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [ogImagePath],
    },
    alternates: {
      canonical: locale === 'pt' ? SITE_URL : `${SITE_URL}/${locale}`,
      languages: {
        'pt-BR': SITE_URL,
        'en-US': `${SITE_URL}/en`,
        'es-ES': `${SITE_URL}/es`,
        'x-default': SITE_URL,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'pt' | 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'H2V Systems',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description: 'Consultoria e desenvolvimento de software de alta performance. Transformamos desafios operacionais em soluções digitais robustas e escaláveis.',
    email: 'hiuryvilanova2012@gmail.com',
    telephone: '+55-61-99172-0301',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brasília',
      addressRegion: 'DF',
      addressCountry: 'BR',
    },
    founder: {
      '@type': 'Person',
      name: 'Hiury Vilanova',
      url: 'https://hiuryvilanova.com',
      jobTitle: 'Software Engineer & Systems Analyst',
      sameAs: [
        'https://www.linkedin.com/in/hiuryvilanova',
        'https://github.com/hiuryvilanova',
      ],
    },
    foundingDate: '2024',
    areaServed: ['BR', 'US', 'ES'],
    serviceType: ['Software Development', 'Web Development', 'Mobile Development', 'Software Architecture', 'Technical Consulting'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+55-61-99172-0301',
      email: 'hiuryvilanova2012@gmail.com',
      availableLanguage: ['Portuguese', 'English', 'Spanish'],
    },
    sameAs: [
      'https://www.linkedin.com/in/hiuryvilanova',
      'https://github.com/hiuryvilanova',
      'https://hiuryvilanova.com',
    ],
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'H2V Systems',
    description: 'Consultoria e desenvolvimento de software de alta performance.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/logo.png" fetchPriority="high" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <SkipToContent />
          <ToastProvider>
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
