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

function memoryCheck(key: string, windowMs: number, max: number): RateLimitResult {
  const now = Date.now()
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

    if (count === 1) {
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

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
