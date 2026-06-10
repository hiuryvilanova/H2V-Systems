// Valida que a Navbar (e botões flutuantes) permanecem fixos durante o scroll.
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3010'

const VIEWPORTS = [
  { name: 'mobile-375', width: 375,  height: 812, isMobile: true },
  { name: 'desk-1280',  width: 1280, height: 800 },
]

;(async () => {
  const browser = await chromium.launch()
  let failures = 0

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: !!vp.isMobile,
      hasTouch: !!vp.isMobile,
      deviceScaleFactor: vp.isMobile ? 2 : 1,
    })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/pt`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const r = await page.evaluate(async () => {
      const nav  = document.querySelector('nav')
      const back = document.querySelector('button[aria-label="Voltar ao topo"]')
      const wa   = document.querySelector('a.whatsapp-float-pos')

      const navBefore  = nav  ? nav.getBoundingClientRect()  : null
      const backBefore = back ? back.getBoundingClientRect() : null
      const waBefore   = wa   ? wa.getBoundingClientRect()   : null

      window.scrollTo(0, 2000)
      await new Promise((r) => setTimeout(r, 600))

      const navAfter  = nav  ? nav.getBoundingClientRect()  : null
      const backAfter = back ? back.getBoundingClientRect() : null
      const waAfter   = wa   ? wa.getBoundingClientRect()   : null

      return {
        scrollY: window.scrollY,
        nav: {
          before: navBefore ? Math.round(navBefore.top)  : null,
          after:  navAfter  ? Math.round(navAfter.top)   : null,
        },
        back: {
          before: backBefore ? Math.round(backBefore.bottom) : null,
          after:  backAfter  ? Math.round(backAfter.bottom)  : null,
        },
        wa: {
          before: waBefore ? Math.round(waBefore.bottom) : null,
          after:  waAfter  ? Math.round(waAfter.bottom)  : null,
        },
        innerH: window.innerHeight,
      }
    })

    const navOk  = r.nav.before === r.nav.after && r.nav.after !== null && Math.abs(r.nav.after) < 5
    const backOk = r.back.after === null || (r.back.after > r.innerH - 100 && r.back.after < r.innerH + 5)
    const waOk   = r.wa.after === null   || (r.wa.after   > r.innerH - 100 && r.wa.after   < r.innerH + 5)

    console.log(`\n[${vp.name}] scrollY=${r.scrollY} innerH=${r.innerH}`)
    console.log(`  Navbar.top    before=${r.nav.before}  after=${r.nav.after}   ${navOk ? 'OK fixed' : 'BROKEN (not fixed)'}`)
    console.log(`  BackTop.bot   before=${r.back.before} after=${r.back.after}  ${backOk ? 'OK' : 'BROKEN'}`)
    console.log(`  WhatsApp.bot  before=${r.wa.before}   after=${r.wa.after}    ${waOk ? 'OK' : 'BROKEN'}`)

    if (!navOk)  failures++
    if (!backOk) failures++
    if (!waOk)   failures++

    await ctx.close()
  }

  await browser.close()
  if (failures > 0) {
    console.log(`\n${failures} problema(s) de posicionamento fixo detectado(s)`)
    process.exit(1)
  } else {
    console.log('\nNavbar e flutuantes 100% fixos em todas as viewports')
  }
})()
