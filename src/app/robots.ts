import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://www.h2vsystems.com.br/sitemap.xml',
    host: 'https://www.h2vsystems.com.br',
  }
}
