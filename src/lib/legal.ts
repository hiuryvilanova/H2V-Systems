import { EMAIL, LOCATION, SITE_URL, WHATSAPP_DISPLAY } from '@/lib/constants'

/**
 * Dados legais publicados no site.
 *
 * Regra: só entra aqui o que é verdadeiro e verificável.
 * CNPJ, razão social e endereço completo NÃO são inventados —
 * quando a pessoa jurídica for constituída, preencha `cnpj` e `legalName`.
 */
export const LEGAL = {
  brand: 'H2V Systems',
  operatorName: 'Hiury Vilanova',
  legalName: '' as string,
  cnpj: '' as string,
  email: EMAIL,
  phoneDisplay: WHATSAPP_DISPLAY,
  location: LOCATION,
  country: 'Brasil',
  siteUrl: SITE_URL,
  governingLaw: 'Brasil',
  venue: 'Brasília, DF',
  lastUpdated: '2026-10-21',
} as const

export function legalIdentification(locale: string): string {
  const hasCompany = Boolean(LEGAL.legalName && LEGAL.cnpj)
  if (locale === 'en') {
    return hasCompany
      ? `${LEGAL.legalName} (${LEGAL.brand}), CNPJ ${LEGAL.cnpj}, operated by ${LEGAL.operatorName}.`
      : `${LEGAL.brand} is a commercial brand operated by ${LEGAL.operatorName}, an individual based in ${LEGAL.location}. A CNPJ will be published here when a legal entity is registered.`
  }
  if (locale === 'es') {
    return hasCompany
      ? `${LEGAL.legalName} (${LEGAL.brand}), CNPJ ${LEGAL.cnpj}, operada por ${LEGAL.operatorName}.`
      : `${LEGAL.brand} es una marca comercial operada por ${LEGAL.operatorName}, persona física con base en ${LEGAL.location}. El CNPJ se publicará aquí cuando se constituya la persona jurídica.`
  }
  return hasCompany
    ? `${LEGAL.legalName} (${LEGAL.brand}), CNPJ ${LEGAL.cnpj}, operada por ${LEGAL.operatorName}.`
    : `${LEGAL.brand} é uma marca comercial operada por ${LEGAL.operatorName}, pessoa física com base em ${LEGAL.location}. O CNPJ será publicado neste documento quando a pessoa jurídica estiver constituída.`
}
