import { MetadataRoute } from 'next'

const BASE = 'https://www.h2vsystems.com.br'

const LOCALES = ['pt', 'en', 'es'] as const
type Locale = (typeof LOCALES)[number]

const localeUrl = (locale: Locale, path = '') =>
  locale === 'pt' ? `${BASE}${path}` : `${BASE}/${locale}${path}`

const buildAlternates = (path = '') => ({
  languages: {
    'pt-BR': localeUrl('pt', path),
    'en-US': localeUrl('en', path),
    'es-ES': localeUrl('es', path),
    'x-default': localeUrl('pt', path),
  },
})

const PAGES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '',                                   priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/servicos/desenvolvimento',          priority: 0.9, changeFrequency: 'monthly' },
  { path: '/servicos/web-mobile',               priority: 0.9, changeFrequency: 'monthly' },
  { path: '/servicos/arquitetura',              priority: 0.9, changeFrequency: 'monthly' },
  { path: '/servicos/dados',                    priority: 0.8, changeFrequency: 'monthly' },
  { path: '/servicos/integracoes',              priority: 0.8, changeFrequency: 'monthly' },
  { path: '/servicos/consultoria',              priority: 0.8, changeFrequency: 'monthly' },
  { path: '/insights',                          priority: 0.7, changeFrequency: 'weekly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const page of PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: localeUrl(locale, page.path),
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: locale === 'pt' ? page.priority : Math.max(0.1, page.priority - 0.1),
        alternates: buildAlternates(page.path),
      })
    }
  }

  return entries
}
