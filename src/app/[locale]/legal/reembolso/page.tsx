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
  const doc = getLegalDocument('refund', locale)
  const prefix = locale === 'pt' ? '' : `/${locale}`
  return {
    title: doc.title,
    description: doc.intro,
    alternates: {
      canonical: `${SITE_URL}${prefix}/legal/reembolso`,
      languages: {
        'pt-BR': `${SITE_URL}/legal/reembolso`,
        'en-US': `${SITE_URL}/en/legal/reembolso`,
        'es-ES': `${SITE_URL}/es/legal/reembolso`,
      },
    },
  }
}

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <LegalPage locale={locale} docId="refund" />
}
