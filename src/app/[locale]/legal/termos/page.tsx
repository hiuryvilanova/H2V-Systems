import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import { getLegalDocument } from '@/lib/legal-content'

const SITE_URL = 'https://www.h2vsystems.com.br'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const doc = getLegalDocument('terms', locale)
  const prefix = locale === 'pt' ? '' : `/${locale}`
  return {
    title: doc.title,
    description: doc.intro,
    alternates: {
      canonical: `${SITE_URL}${prefix}/legal/termos`,
      languages: {
        'pt-BR': `${SITE_URL}/legal/termos`,
        'en-US': `${SITE_URL}/en/legal/termos`,
        'es-ES': `${SITE_URL}/es/legal/termos`,
      },
    },
  }
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <LegalPage locale={locale} docId="terms" />
}
