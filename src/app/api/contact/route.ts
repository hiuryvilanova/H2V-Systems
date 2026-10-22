import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import {
  LIMITS,
  cleanLine,
  cleanText,
  escapeHtml,
  isValidEmail,
  rateLimitHeaders,
  readJson,
} from '@/lib/validation'

export const runtime = 'nodejs'

type ContactPayload = {
  nome?:        unknown
  email?:       unknown
  empresa?:     unknown
  telefone?:    unknown
  servico?:     unknown
  mensagem?:    unknown
  hp?:          unknown
  lgpdConsent?: unknown
}

const TO_EMAIL   = process.env.CONTACT_TO_EMAIL   || 'hiuryhenrique2012@gmail.com'
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'H2V Systems <onboarding@resend.dev>'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = await checkRateLimit(ip, { windowMs: WINDOW_MS, max: MAX_PER_WINDOW, bucket: 'contact' })
    if (!rl.ok) {
      return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429, headers: rateLimitHeaders(rl) })
    }

    const raw = await readJson<ContactPayload>(req)
    if (!raw) {
      return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
    }

    // Honeypot: bots preenchem o campo oculto — respondemos 200 sem enviar nada.
    if (typeof raw.hp === 'string' && raw.hp.length > 0) {
      return NextResponse.json({ ok: true })
    }
    if (raw.lgpdConsent !== true) {
      return NextResponse.json({ ok: false, error: 'Consent required' }, { status: 400 })
    }

    const data = {
      nome:     cleanLine(raw.nome, LIMITS.nome),
      email:    cleanLine(raw.email, LIMITS.email).toLowerCase(),
      empresa:  cleanLine(raw.empresa, LIMITS.empresa),
      telefone: cleanLine(raw.telefone, LIMITS.telefone),
      servico:  cleanLine(raw.servico, LIMITS.servico),
      mensagem: cleanText(raw.mensagem),
    }

    if (!data.nome || !data.email || !data.mensagem) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }
    if (!isValidEmail(data.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }
    if (data.mensagem.length > LIMITS.mensagem) {
      return NextResponse.json({ ok: false, error: 'Message too long' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[contact] RESEND_API_KEY ausente em produção — mensagem NÃO foi entregue.')
        return NextResponse.json({ ok: false, error: 'Email service not configured' }, { status: 503 })
      }
      console.log('[contact] RESEND_API_KEY not set; logging submission instead:', {
        ...data,
        mensagem: data.mensagem.slice(0, 200) + (data.mensagem.length > 200 ? '...' : ''),
      })
      return NextResponse.json({ ok: true, mode: 'dev' })
    }

    const resend = new Resend(apiKey)

    const row = (label: string, value: string) =>
      value
        ? `<tr><td style="padding: 8px 0; color: #888; width: 130px;">${label}</td><td style="padding: 8px 0;">${escapeHtml(value)}</td></tr>`
        : ''

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #E84B1A, #BF3808); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 22px;">Novo contato — H2V Systems</h1>
          <p style="margin: 4px 0 0; opacity: 0.9;">Recebido em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
        </div>
        <div style="background: #fafafa; padding: 24px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 130px;">Nome</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.nome)}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${encodeURIComponent(data.email).replace('%40', '@')}">${escapeHtml(data.email)}</a></td></tr>
            ${row('Empresa', data.empresa)}
            ${row('Telefone', data.telefone)}
            ${row('Serviço', data.servico)}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #E84B1A;">
            <div style="color: #888; font-size: 13px; margin-bottom: 8px;">Mensagem</div>
            <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(data.mensagem)}</div>
          </div>
        </div>
      </div>
    `

    const text = [
      `Nome: ${data.nome}`,
      `E-mail: ${data.email}`,
      ...(data.empresa  ? [`Empresa: ${data.empresa}`]   : []),
      ...(data.telefone ? [`Telefone: ${data.telefone}`] : []),
      ...(data.servico  ? [`Serviço: ${data.servico}`]   : []),
      '',
      data.mensagem,
    ].join('\n')

    const subject = `[H2V Systems] ${data.nome}${data.empresa ? ` (${data.empresa})` : ''}`.slice(0, 200)

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      return NextResponse.json({ ok: false, error: 'Email service error' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
