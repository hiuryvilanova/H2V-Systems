/**
 * Helpers de validação/sanitização compartilhados pelas rotas de API.
 */

/** E-mail pragmático: sem espaços, sem < > " ' e com TLD de 2+ letras. */
export const EMAIL_REGEX = /^[^\s@<>"'()[\]\\,;:]+@[^\s@<>"'()[\]\\,;:]+\.[a-z]{2,}$/i

export const LIMITS = {
  email:    254,
  nome:     120,
  empresa:  160,
  telefone: 40,
  servico:  120,
  mensagem: 5000,
} as const

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Campo de uma linha: remove caracteres de controle/quebras e espaços duplicados. */
export function cleanLine(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Texto livre (multi-linha): normaliza quebras e remove controles exceto \n e \t. */
export function cleanText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    .trim()
}

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= LIMITS.email && EMAIL_REGEX.test(email)
}

/** Lê o corpo JSON com limite de tamanho; retorna null se inválido ou grande demais. */
export async function readJson<T>(req: Request, maxBytes = 16_000): Promise<T | null> {
  const len = Number(req.headers.get('content-length') || 0)
  if (len > maxBytes) return null
  try {
    const text = await req.text()
    if (text.length > maxBytes) return null
    const data = JSON.parse(text)
    return data && typeof data === 'object' ? (data as T) : null
  } catch {
    return null
  }
}

/** Headers padrão da resposta 429. */
export function rateLimitHeaders(rl: { remaining: number; reset: number }) {
  return {
    'Retry-After':           String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000))),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset':     String(rl.reset),
  }
}
