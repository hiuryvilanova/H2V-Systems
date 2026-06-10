/* H2V Systems — Service Worker
 *
 * Strategy
 *   • Precache: app shell crítico (offline page + logo)
 *   • Static assets (/_next/static/*, imagens, fontes): cache-first
 *   • Navegação (HTML/RSC): network-first com fallback para cache → offline.html
 *   • Demais GET: stale-while-revalidate
 */

const VERSION = 'v1.0.0'
const STATIC_CACHE = `h2v-static-${VERSION}`
const RUNTIME_CACHE = `h2v-runtime-${VERSION}`
const PAGES_CACHE = `h2v-pages-${VERSION}`

const PRECACHE_URLS = [
  '/offline.html',
  '/logo.png',
  '/favicon.ico',
  '/manifest.webmanifest',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE, PAGES_CACHE].includes(k))
          .map((k) => caches.delete(k)),
      )
      await self.clients.claim()
    })(),
  )
})

const isStaticAsset = (url) =>
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/cases/') ||
  /\.(?:js|css|woff2?|ttf|png|jpg|jpeg|webp|avif|svg|ico)$/i.test(url.pathname)

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

const networkFirstPage = async (request) => {
  const cache = await caches.open(PAGES_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    const offline = await caches.match('/offline.html')
    return offline || new Response('Offline', { status: 503, statusText: 'Offline' })
  }
}

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE)
  const cached = await cache.match(request)
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  return cached || network
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstPage(request))
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  event.respondWith(staleWhileRevalidate(request))
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})
