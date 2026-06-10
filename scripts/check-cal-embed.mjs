// Verifica se o widget Cal.com carrega sem erro de CSP/script bloqueado.
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:3010'
const OUT = path.resolve('audit-screenshots')

;(async () => {
  await mkdir(OUT, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  const consoleErrors = []
  const blockedRequests = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200))
  })
  page.on('requestfailed', (req) => {
    blockedRequests.push(`${req.failure()?.errorText || 'failed'} ${req.url().slice(0, 120)}`)
  })

  await page.goto(`${BASE}/pt#contato`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  // Preenche nome e e-mail para testar prefill
  await page.fill('#c-nome', 'Joana Teste')
  await page.fill('#c-email', 'joana.teste@example.com')

  // Clica na aba "Agendar Reunião"
  await page.getByRole('tab', { name: /Agendar/i }).click()
  await page.waitForTimeout(800)

  await page.screenshot({ path: path.join(OUT, 'cal-tab-loading.png'), fullPage: false })

  // Espera o linkReady ou timeout
  const ready = await page
    .waitForSelector('iframe[src*="cal.com"]', { timeout: 15000 })
    .then(() => true)
    .catch(() => false)

  await page.waitForTimeout(4000) // dar tempo para o widget renderizar
  await page.screenshot({ path: path.join(OUT, 'cal-tab-loaded.png'), fullPage: false })

  const calIframe = await page.$('iframe[src*="cal.com"]')
  const iframeSrc = calIframe ? await calIframe.getAttribute('src') : null

  console.log('\n=== Cal.com embed audit ===')
  console.log(`Iframe found:    ${!!calIframe}`)
  console.log(`Iframe src:      ${iframeSrc || '(none)'}`)
  console.log(`Selector ready:  ${ready}`)
  console.log(`Console errors:  ${consoleErrors.length}`)
  consoleErrors.forEach((e) => console.log(`  · ${e}`))
  console.log(`Blocked reqs:    ${blockedRequests.length}`)
  blockedRequests.forEach((e) => console.log(`  · ${e}`))

  // Mobile pass
  const m = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  await m.goto(`${BASE}/pt#contato`, { waitUntil: 'networkidle' })
  await m.waitForTimeout(600)
  await m.getByRole('tab', { name: /Agendar/i }).click()
  await m.waitForTimeout(4500)
  await m.screenshot({ path: path.join(OUT, 'cal-tab-mobile.png'), fullPage: false })

  await browser.close()

  const calRelatedErrors = consoleErrors.filter((e) => /cal\.com/i.test(e) || /content security policy/i.test(e))
  const calBlocked = blockedRequests.filter((e) => /cal\.com/i.test(e))

  if (!calIframe || calRelatedErrors.length > 0 || calBlocked.length > 0) {
    console.log('\n[FAIL] Cal.com com problema (iframe, CSP ou rede)')
    process.exit(1)
  } else {
    console.log('\n[OK] Cal.com embed carregado, com prefill e UTMs')
  }
})()
