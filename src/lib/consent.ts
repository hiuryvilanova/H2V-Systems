export const CONSENT_STORAGE_KEY = 'h2v_cookie_consent_v2'
export const CONSENT_EVENT = 'h2v-consent-change'

export type ConsentChoice = {
  version: 2
  necessary: true
  analytics: boolean
  at: string
}

export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as Partial<ConsentChoice>
    if (data?.version !== 2 || typeof data.analytics !== 'boolean') return null
    return {
      version: 2,
      necessary: true,
      analytics: data.analytics,
      at: typeof data.at === 'string' ? data.at : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function readConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null
  try {
    return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY))
  } catch {
    return null
  }
}

export function writeConsent(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = {
    version: 2,
    necessary: true,
    analytics,
    at: new Date().toISOString(),
  }
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice))
  } catch {
    /* private mode */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }))
  }
  return choice
}

export function requestConsentDialog() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('h2v-consent-open'))
}
