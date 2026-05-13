import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TO_EMAIL    = process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'hiuryvilanova2012@gmail.com'
const FROM_EMAIL  = process.env.CONTACT_FROM_EMAIL  || 'H2V Systems <onboarding@resend.dev>'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 3

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = await checkRateLimit(ip, { windowMs: WINDOW_MS, max: MAX_PER_WINDOW, bucket: 'newsletter' })
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After':           String(Math.ceil((rl.reset - Date.now()) / 1000)),
            'X-RateLimit-Remaining': String(rl.remaining),
            'X-RateLimit-Reset':     String(rl.reset),
          },
        },
      )
    }

    const { email } = (await req.json()) as { email?: string }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log('[newsletter] subscription (dev mode):', email)
      return NextResponse.json({ ok: true, mode: 'dev' })
    }

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `[H2V Newsletter] Nova inscrição: ${email}`,
      html: `<p>Nova inscrição na newsletter da H2V Systems:</p><p><strong>${email}</strong></p>`,
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
