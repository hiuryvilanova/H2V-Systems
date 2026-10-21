/**
 * Rate limiter unificado.
 *
 * Em produção: usa Upstash Redis (REST) — persistente entre invocações serverless.
 * Em dev / sem ENV: cai para um Map em memória (perdido a cada restart).
 *
 * ENVs necessárias para Upstash:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

type RateLimitResult = {
  ok: boolean
  remaining: number
  reset: number
}

const memoryStore = new Map<string, { count: number; firstAt: number }>()

const MEMORY_MAX_KEYS = 5_000

function memoryCheck(key: string, windowMs: number, max: number): RateLimitResult {
  const now = Date.now()

  // Evita crescimento ilimitado do Map em instâncias de longa duração.
  if (memoryStore.size > MEMORY_MAX_KEYS) {
    for (const [k, v] of memoryStore) {
      if (now - v.firstAt >= windowMs) memoryStore.delete(k)
    }
  }
  const rec = memoryStore.get(key)

  if (!rec || now - rec.firstAt >= windowMs) {
    memoryStore.set(key, { count: 1, firstAt: now })
    return { ok: true, remaining: max - 1, reset: now + windowMs }
  }

  rec.count++
  return {
    ok: rec.count <= max,
    remaining: Math.max(0, max - rec.count),
    reset: rec.firstAt + windowMs,
  }
}

async function upstashCheck(
  url: string,
  token: string,
  key: string,
  windowMs: number,
  max: number,
): Promise<RateLimitResult> {
  const windowSec = Math.ceil(windowMs / 1000)

  try {
    const incrRes = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!incrRes.ok) throw new Error(`Upstash incr failed: ${incrRes.status}`)
    const incrJson = (await incrRes.json()) as { result: number }
    const count = incrJson.result

    // Garante TTL mesmo se um EXPIRE anterior tiver falhado (evita chave "eterna" bloqueando o IP).
    // NX: só define se a chave ainda não tiver TTL.
    const ttlRes = await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSec}/NX`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!ttlRes.ok && count === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSec}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
    }

    return {
      ok: count <= max,
      remaining: Math.max(0, max - count),
      reset: Date.now() + windowMs,
    }
  } catch (err) {
    console.error('[rate-limit] Upstash error, falling back to memory:', err)
    return memoryCheck(key, windowMs, max)
  }
}

export async function checkRateLimit(
  identifier: string,
  options: { windowMs: number; max: number; bucket?: string },
): Promise<RateLimitResult> {
  const key = `rl:${options.bucket ?? 'default'}:${identifier}`
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    return upstashCheck(url, token, key, options.windowMs, options.max)
  }
  return memoryCheck(key, options.windowMs, options.max)
}

/**
 * IP do cliente para fins de rate limit.
 *
 * O primeiro valor de `x-forwarded-for` é controlado pelo cliente (pode ser forjado
 * para burlar o limite). Preferimos os headers definidos pela própria plataforma:
 *   • `x-real-ip` / `x-vercel-forwarded-for` (Vercel sobrescreve, não confia no cliente)
 *   • senão, o ÚLTIMO IP do `x-forwarded-for` (adicionado pelo proxy mais próximo).
 */
export function getClientIp(req: Request): string {
  const h = req.headers
  const direct = h.get('x-vercel-forwarded-for') || h.get('x-real-ip')
  if (direct) return direct.split(',')[0].trim()

  const xff = h.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1]
  }
  return 'unknown'
}
