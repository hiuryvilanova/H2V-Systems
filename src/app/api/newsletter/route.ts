import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { LIMITS, cleanLine, escapeHtml, isValidEmail, rateLimitHeaders, readJson } from '@/lib/validation'

export const runtime = 'nodejs'

const TO_EMAIL   = process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'hiuryhenrique2012@gmail.com'
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL  || 'H2V Systems <onboarding@resend.dev>'
/** Opcional: ID de um Segment do Resend para guardar os inscritos de verdade. */
const SEGMENT_ID = process.env.RESEND_SEGMENT_ID

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 3

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = await checkRateLimit(ip, { windowMs: WINDOW_MS, max: MAX_PER_WINDOW, bucket: 'newsletter' })
    if (!rl.ok) {
      return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429, headers: rateLimitHeaders(rl) })
    }

    const body = await readJson<{ email?: unknown; hp?: unknown }>(req, 2_000)
    if (!body) {
      return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
    }
    if (typeof body.hp === 'string' && body.hp.length > 0) {
      return NextResponse.json({ ok: true })
    }

    const email = cleanLine(body.email, LIMITS.email).toLowerCase()
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[newsletter] RESEND_API_KEY ausente em produção — inscrição NÃO registrada.')
        return NextResponse.json({ ok: false, error: 'Email service not configured' }, { status: 503 })
      }
      console.log('[newsletter] subscription (dev mode):', email)
      return NextResponse.json({ ok: true, mode: 'dev' })
    }

    const resend = new Resend(apiKey)

    // Guarda o contato no Resend (Contacts/Segment) (permite envio em massa + descadastro, exigido pela LGPD).
    if (SEGMENT_ID) {
      const { error } = await resend.contacts.create({ email, unsubscribed: false, segments: [{ id: SEGMENT_ID }] })
      if (error && !/already exists/i.test(error.message ?? '')) {
        console.error('[newsletter] Resend contacts error:', error)
      }
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `[H2V Newsletter] Nova inscrição: ${email}`,
      html: `<p>Nova inscrição na newsletter da H2V Systems:</p><p><strong>${escapeHtml(email)}</strong></p>`,
      text: `Nova inscrição na newsletter da H2V Systems: ${email}`,
    })

    if (error) {
      console.error('[newsletter] Resend error:', error)
      return NextResponse.json({ ok: false, error: 'Email service error' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[newsletter] Unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
