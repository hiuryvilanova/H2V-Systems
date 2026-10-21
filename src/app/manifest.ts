import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'H2V Systems — Tecnologia de Precisão',
    short_name: 'H2V Systems',
    description: 'Consultoria e desenvolvimento de software de alta performance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0a08',
    theme_color: '#c2410c',
    orientation: 'portrait-primary',
    lang: 'pt-BR',
    categories: ['business', 'productivity', 'technology'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
