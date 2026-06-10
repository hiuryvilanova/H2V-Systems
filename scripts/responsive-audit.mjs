// Auditoria automatizada de responsividade.
// - Visita rotas principais em vários viewports
// - Tira screenshot full-page
// - Detecta horizontal scroll
// - Detecta elementos que ultrapassam a largura do viewport

import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:3010'
const OUT  = path.resolve('audit-screenshots')

const VIEWPORTS = [
  { name: 'mobile-360',  width: 360,  height: 780, isMobile: true,  hasTouch: true },
  { name: 'mobile-375',  width: 375,  height: 812, isMobile: true,  hasTouch: true },
  { name: 'mobile-414',  width: 414,  height: 896, isMobile: true,  hasTouch: true },
  { name: 'tablet-768',  width: 768,  height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 1366 },
  { name: 'desk-1280',   width: 1280, height: 800  },
  { name: 'desk-1440',   width: 1440, height: 900  },
]

const ROUTES = [
  { name: 'home',          path: '/pt' },
  { name: 'insights',      path: '/pt/insights' },
  { name: 'insight-slug',  path: '/pt/insights/arquitetura-microsservicos' },
  { name: 'servico-slug',  path: '/pt/servicos/desenvolvimento' },
]

async function auditPage(page, label) {
  // Espera ficar idle
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(500)

  // Rolar até o fim da página para acionar todas as animações `whileInView`
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const step = window.innerHeight * 0.7
      const tick = () => {
        window.scrollTo(0, y)
        y += step
        if (y < document.documentElement.scrollHeight) {
          requestAnimationFrame(tick)
        } else {
          window.scrollTo(0, 0)
          setTimeout(resolve, 600)
        }
      }
      tick()
    })
  })
  await page.waitForTimeout(800)

  const result = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth
    const winW = window.innerWidth

    // Acha elementos que ultrapassam a largura da viewport
    const overflows = []
    const all = document.querySelectorAll('body *')
    for (const el of all) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      // Tolerância de 1px
      if (r.right > winW + 1) {
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed' || cs.position === 'absolute') continue
        overflows.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && typeof el.className === 'string'
                ? el.className.slice(0, 100) : ''),
          id: el.id || '',
          right: Math.round(r.right),
          width: Math.round(r.width),
        })
        if (overflows.length >= 5) break
      }
    }
    return {
      docWidth: docW,
      winWidth: winW,
      hasHorizontalScroll: docW > winW + 1,
      overflows,
    }
  })

  result.label = label
  return result
}

;(async () => {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const report = []

  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.isMobile ? 2 : 1,
        userAgent: vp.isMobile
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36',
        isMobile: !!vp.isMobile,
        hasTouch: !!vp.hasTouch,
        reducedMotion: 'reduce', // CSS @media (prefers-reduced-motion: reduce) — anula animações
      })
      const page = await ctx.newPage()
      const url = `${BASE}${route.path}`
      const label = `${route.name}__${vp.name}`
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null)
        const audit = await auditPage(page, label)
        const shotPath = path.join(OUT, `${label}.png`)
        await page.screenshot({ path: shotPath, fullPage: true })
        audit.screenshot = shotPath
        audit.url = url
        report.push(audit)
        const flag = audit.hasHorizontalScroll ? 'OVERFLOW' : (audit.overflows.length ? 'WARN' : 'OK')
        console.log(`[${flag}] ${label} doc=${audit.docWidth} win=${audit.winWidth} overflows=${audit.overflows.length}`)
        if (audit.overflows.length) {
          for (const o of audit.overflows) {
            console.log(`         > <${o.tag}.${o.cls.split(' ').slice(0,2).join('.')}> right=${o.right} width=${o.width}`)
          }
        }
      } catch (e) {
        console.log(`[FAIL] ${label}: ${e.message}`)
      } finally {
        await ctx.close()
      }
    }
  }

  await writeFile(
    path.join(OUT, 'report.json'),
    JSON.stringify(report, null, 2),
    'utf-8',
  )
  await browser.close()
  console.log('\nDone. Report saved to audit-screenshots/report.json')
})()
