import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { routing } from '@/i18n/routing'
import { ToastProvider } from '@/components/ui/Toast'
import SkipToContent from '@/components/ui/SkipToContent'
import SWRegister from '@/components/ui/SWRegister'
import '../globals.css'

const SITE_URL = 'https://www.h2vsystems.com.br'

/** Tipografia principal: sólida e comum em produtos B2B / consultoria premium */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
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
  themeColor: '#c2410c',
  /** Permite `env(safe-area-inset-*)` em iPhones com notch e home indicator. */
  viewportFit: 'cover',
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
    email: 'hiuryhenrique2012@gmail.com',
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
      jobTitle: 'Systems Analyst',
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
      email: 'hiuryhenrique2012@gmail.com',
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

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'H2V Systems',
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: '+55-61-99172-0301',
    email: 'hiuryhenrique2012@gmail.com',
    priceRange: '$$$',
    description: 'Consultoria e desenvolvimento de software de alta performance — engenharia de sistemas, arquitetura cloud, microsserviços e modernização de legados.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brasília',
      addressRegion: 'DF',
      postalCode: '70000-000',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -15.7942,
      longitude: -47.8822,
    },
    areaServed: [
      { '@type': 'Country', name: 'Brazil' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Spain' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/in/hiuryvilanova',
      'https://github.com/hiuryvilanova',
      'https://hiuryvilanova.com',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços de Engenharia de Software H2V Systems',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Desenvolvimento Customizado',
            serviceType: 'Software Development',
            description: 'Construção de sistemas sob medida em Java, Kotlin, TypeScript e Python com Clean Architecture.',
            url: `${SITE_URL}/servicos/desenvolvimento`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Aplicações Web & Mobile',
            serviceType: 'Web and Mobile Development',
            description: 'Aplicações performáticas com Next.js, React Native e Flutter, focadas em UX e SEO técnico.',
            url: `${SITE_URL}/servicos/web-mobile`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Arquitetura & Escalabilidade',
            serviceType: 'Software Architecture',
            description: 'Desenho de microsserviços, mensageria distribuída (Kafka), Kubernetes e cloud híbrida.',
            url: `${SITE_URL}/servicos/arquitetura`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Engenharia de Dados',
            serviceType: 'Data Engineering',
            description: 'Pipelines ETL, data lakes (S3/ClickHouse) e dashboards com PostgreSQL, MongoDB e Redis.',
            url: `${SITE_URL}/servicos/dados`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Integrações de Sistemas',
            serviceType: 'System Integration',
            description: 'REST/GraphQL APIs, Webhooks, RPA e automações n8n entre sistemas legados e modernos.',
            url: `${SITE_URL}/servicos/integracoes`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Consultoria Técnica',
            serviceType: 'Technical Consulting',
            description: 'Code review, auditoria de cloud, DevOps e formação de times de engenharia.',
            url: `${SITE_URL}/servicos/consultoria`,
          },
        },
      ],
    },
  }

  return (
    <html
      lang={locale}
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <SkipToContent />
          <ToastProvider>
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
        <SWRegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
