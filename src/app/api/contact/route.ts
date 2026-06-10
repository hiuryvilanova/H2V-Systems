import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

type ContactPayload = {
  nome:     string
  email:    string
  empresa?: string
  telefone?: string
  servico?:  string
  mensagem: string
  hp?:       string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TO_EMAIL    = process.env.CONTACT_TO_EMAIL  || 'hiuryhenrique2012@gmail.com'
const FROM_EMAIL  = process.env.CONTACT_FROM_EMAIL || 'H2V Systems <onboarding@resend.dev>'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = await checkRateLimit(ip, { windowMs: WINDOW_MS, max: MAX_PER_WINDOW, bucket: 'contact' })
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After':            String(Math.ceil((rl.reset - Date.now()) / 1000)),
            'X-RateLimit-Remaining':  String(rl.remaining),
            'X-RateLimit-Reset':      String(rl.reset),
          },
        },
      )
    }

    const data = (await req.json()) as ContactPayload

    if (data.hp && data.hp.length > 0) {
      return NextResponse.json({ ok: true })
    }

    if (!data.nome?.trim() || !data.email?.trim() || !data.mensagem?.trim()) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }
    if (!EMAIL_REGEX.test(data.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }
    if (data.mensagem.length > 5000) {
      return NextResponse.json({ ok: false, error: 'Message too long' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log('[contact] RESEND_API_KEY not set; logging submission instead:', {
        nome: data.nome, email: data.email, empresa: data.empresa,
        telefone: data.telefone, servico: data.servico,
        mensagem: data.mensagem.slice(0, 200) + (data.mensagem.length > 200 ? '...' : ''),
      })
      return NextResponse.json({ ok: true, mode: 'dev' })
    }

    const resend = new Resend(apiKey)

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #E84B1A, #BF3808); padding: 24px; border-radius: 12px 12px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 22px;">Novo contato — H2V Systems</h1>
          <p style="margin: 4px 0 0; opacity: 0.9;">Recebido em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
        </div>
        <div style="background: #fafafa; padding: 24px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 130px;">Nome</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.nome)}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
            ${data.empresa ? `<tr><td style="padding: 8px 0; color: #888;">Empresa</td><td style="padding: 8px 0;">${escapeHtml(data.empresa)}</td></tr>` : ''}
            ${data.telefone ? `<tr><td style="padding: 8px 0; color: #888;">Telefone</td><td style="padding: 8px 0;">${escapeHtml(data.telefone)}</td></tr>` : ''}
            ${data.servico ? `<tr><td style="padding: 8px 0; color: #888;">Serviço</td><td style="padding: 8px 0;">${escapeHtml(data.servico)}</td></tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #E84B1A;">
            <div style="color: #888; font-size: 13px; margin-bottom: 8px;">Mensagem</div>
            <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(data.mensagem)}</div>
          </div>
        </div>
      </div>
    `

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `[H2V Systems] ${data.nome}${data.empresa ? ` (${data.empresa})` : ''}`,
      html,
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
