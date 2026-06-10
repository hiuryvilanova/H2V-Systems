'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Mail, CheckCircle, MapPin, MessageSquare, Calendar, ExternalLink } from 'lucide-react'
import { WhatsAppIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { useToast } from '@/components/ui/Toast'
import { WHATSAPP_LINK, WHATSAPP_DISPLAY, EMAIL, LINKEDIN_URL, LOCATION, CAL_LINK } from '@/lib/constants'

// Cal.com embed só carrega quando o usuário muda para a aba "Agendar".
const CalEmbed = dynamic(() => import('@/components/ui/CalEmbed'), { ssr: false })

type FormState = {
  nome: string; email: string; empresa: string;
  telefone: string; servico: string; mensagem: string; hp: string;
}

function buildWhatsAppMessage(locale: string, f: FormState): string {
  const L = locale === 'es'
    ? { header: 'Nuevo contacto desde h2vsystems.com.br', greet: 'Hola, soy', co: 'Empresa', em: 'E-mail', ph: 'Teléfono', sv: 'Servicio de interés', ms: 'Mensaje', sent: 'Enviado por el formulario del sitio' }
    : locale === 'en'
    ? { header: 'New contact from h2vsystems.com.br',     greet: 'Hi, I am',  co: 'Company', em: 'Email',  ph: 'Phone',    sv: 'Service of interest',  ms: 'Message', sent: 'Sent via the website contact form' }
    : { header: 'Novo contato pelo site h2vsystems.com.br', greet: 'Olá, sou', co: 'Empresa', em: 'E-mail', ph: 'Telefone', sv: 'Serviço de interesse', ms: 'Mensagem', sent: 'Enviado pelo formulário do site' }

  const lines: string[] = [
    `*${L.header}*`,
    '',
    `${L.greet} *${f.nome.trim()}*.`,
    '',
    `*${L.em}:* ${f.email.trim()}`,
  ]
  if (f.empresa.trim())  lines.push(`*${L.co}:* ${f.empresa.trim()}`)
  if (f.telefone.trim()) lines.push(`*${L.ph}:* ${f.telefone.trim()}`)
  if (f.servico.trim())  lines.push(`*${L.sv}:* ${f.servico.trim()}`)
  lines.push('', `*${L.ms}:*`, f.mensagem.trim(), '', `_${L.sent}_`)

  return lines.join('\n')
}

function buildWhatsAppUrl(locale: string, f: FormState): string {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(buildWhatsAppMessage(locale, f))}`
}

type Mode = 'message' | 'schedule'
type FieldKey = 'nome' | 'email' | 'empresa' | 'telefone' | 'mensagem'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+()\s\d-]{8,}$/

export default function Contact() {
  const t = useTranslations('Contact')
  const locale = useLocale()
  const toast = useToast()
  const serviceOptions = t.raw('servicesOptions') as string[]

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const [mode, setMode] = useState<Mode>('message')
  const [form, setForm] = useState<FormState>({ nome: '', email: '', empresa: '', telefone: '', servico: '', mensagem: '', hp: '' })
  const [lastWaUrl, setLastWaUrl] = useState<string>('')
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({ nome: false, email: false, empresa: false, telefone: false, mensagem: false })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [scheduledOk, setScheduledOk] = useState(false)

  const validate = (k: FieldKey, v: string): boolean => {
    if (k === 'nome')     return v.trim().length >= 2
    if (k === 'email')    return EMAIL_RE.test(v.trim())
    if (k === 'mensagem') return v.trim().length >= 10
    if (k === 'telefone') return v.trim() === '' || PHONE_RE.test(v.trim())
    if (k === 'empresa')  return true
    return true
  }

  const fieldState = (k: FieldKey): 'is-valid' | 'is-invalid' | '' => {
    const v = form[k]
    if (!touched[k] && !v) return ''
    const ok = validate(k, v)
    if (k === 'empresa' || (k === 'telefone' && !v)) return ok && v ? 'is-valid' : ''
    if (!v && (k === 'nome' || k === 'email' || k === 'mensagem')) return touched[k] ? 'is-invalid' : ''
    return ok ? 'is-valid' : 'is-invalid'
  }

  const canScheduleDirect = useMemo(
    () => validate('nome', form.nome) && validate('email', form.email),
    [form.nome, form.email]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldKey
    if (name in touched) setTouched((s) => ({ ...s, [name]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ nome: true, email: true, empresa: true, telefone: true, mensagem: true })
    if (!form.nome || !form.email || !form.mensagem) {
      toast.error(t('formErrorRequired'))
      return
    }
    if (!EMAIL_RE.test(form.email)) {
      toast.error(t('formErrorEmail'))
      return
    }

    // Abre o WhatsApp do especialista no mesmo gesto do clique para evitar
    // bloqueio de popup. A mensagem leva nome, contato e o texto digitado.
    const waUrl = buildWhatsAppUrl(locale, form)
    setLastWaUrl(waUrl)
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        toast.error(t('formErrorServer'))
        setLoading(false)
        return
      }
      toast.success(t('successTitle'))
      setLoading(false)
      setSubmitted(true)
    } catch {
      toast.error(t('formErrorServer'))
      setLoading(false)
    }
  }

  const calPath = useMemo(() => CAL_LINK.replace(/^https?:\/\/cal\.com\//, ''), [])

  /** Link "abrir em nova aba" com prefill manual via querystring (funciona em qualquer booking page). */
  const calExternalUrl = useMemo(() => {
    const u = new URL(CAL_LINK)
    if (canScheduleDirect) {
      u.searchParams.set('name', form.nome.trim())
      u.searchParams.set('email', form.email.trim())
    }
    u.searchParams.set('utm_source',   'h2vsystems')
    u.searchParams.set('utm_medium',   'website')
    u.searchParams.set('utm_campaign', 'contact_section')
    return u.toString()
  }, [canScheduleDirect, form.nome, form.email])

  const calLocale = locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es' : 'en'

  const handleBookingSuccessful = useCallback(() => {
    setScheduledOk(true)
    toast.success(t('scheduleSuccessToast'))
  }, [toast, t])

  type IconCmp = (props: { size?: number; strokeWidth?: number; color?: string }) => React.ReactElement
  const channels: Array<{ icon: IconCmp; brand?: boolean; label: string; value: string; href?: string }> = [
    { icon: WhatsAppIcon as IconCmp, brand: true,  label: t('channelWaLabel'),       value: WHATSAPP_DISPLAY,          href: WHATSAPP_LINK },
    { icon: Mail as unknown as IconCmp,            label: t('channelEmailLabel'),     value: EMAIL,                     href: `mailto:${EMAIL}` },
    { icon: LinkedInIcon as IconCmp, brand: true,  label: t('channelLinkedinLabel'),  value: t('channelLinkedinValue'), href: LINKEDIN_URL },
    { icon: MapPin as unknown as IconCmp,          label: t('channelLocationLabel'),  value: LOCATION                                                  },
  ]

  const labels = {
    tabMessage:    t('tabMessage'),
    tabSchedule:   t('tabSchedule'),
    scheduleHint:  t('scheduleHint'),
    scheduleReady: t('scheduleReady'),
  }

  return (
    <section id="contato" ref={sectionRef} className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden bg-neutral-950 border-t border-neutral-900">
      <motion.div aria-hidden="true" className="absolute inset-[-20%] pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: `
          radial-gradient(ellipse 60% 50% at 70% 50%, rgba(249,115,22,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 20% 30%, rgba(239,68,68,0.04) 0%, transparent 50%)
        `}} />
      </motion.div>

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          className="mb-12 sm:mb-16 max-w-[640px]"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.65 }}>
          <span className="tag-badge">{t('tag')}</span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mt-4 mb-4 text-white">
            {t('title')} <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 sm:gap-14 xl:gap-24 items-start">

          {/* Info Side */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
            <p className="text-sm sm:text-base leading-[1.8] mb-8 sm:mb-10 text-neutral-400">{t('description')}</p>

            <div className="flex flex-col gap-4">
              {channels.map((ch) => {
                const Icon = ch.icon
                const baseClass = 'flex items-center gap-4 p-4 rounded-2xl no-underline transition-all duration-300 border border-neutral-900 bg-neutral-900/20 backdrop-blur-sm text-white'
                const interactiveClass = ch.href ? 'hover:translate-x-1.5 hover:border-orange-500/20 hover:bg-neutral-900/40' : ''
                const iconProps = ch.brand ? { size: 18, color: 'var(--cyan)' } : { size: 18, strokeWidth: 2, color: 'var(--cyan)' }
                const inner = (
                  <>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-500/5 border border-neutral-800 transition-colors duration-300 group-hover:border-orange-500/20">
                      <Icon {...iconProps} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{ch.label}</span>
                      <strong className="text-sm block break-words mt-0.5 text-neutral-200">{ch.value}</strong>
                    </div>
                  </>
                )
                return ch.href ? (
                  <a key={ch.label} href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className={`${baseClass} ${interactiveClass} group`}>
                    {inner}
                  </a>
                ) : (
                  <div key={ch.label} className={baseClass}>{inner}</div>
                )
              })}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div className="w-full min-w-0 lg:sticky lg:top-28 self-start"
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
            <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/30 backdrop-blur-md p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-red-500/20" />

              {/* Tabs: Mensagem | Agendar */}
              {!submitted && (
                <div role="tablist" aria-label="Contato" className="relative z-10 inline-flex p-1 mb-6 rounded-xl bg-neutral-950/80 border border-neutral-800/80 gap-1">
                  {(['message', 'schedule'] as Mode[]).map((m) => {
                    const Icon = m === 'message' ? MessageSquare : Calendar
                    const label = m === 'message' ? labels.tabMessage : labels.tabSchedule
                    const active = mode === m
                    return (
                      <button
                        key={m}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setMode(m)}
                        type="button"
                        className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                          active ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="contact-tab-bg"
                            className="absolute inset-0 rounded-lg bg-orange-500/15 border border-orange-500/30"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                          />
                        )}
                        <Icon size={14} className="relative z-10" />
                        <span className="relative z-10">{label}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                {!submitted && mode === 'message' && (
                  <motion.form
                    key="message-form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="relative z-10 flex flex-col gap-5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Honeypot anti-spam */}
                    <input
                      type="text" name="hp" tabIndex={-1} autoComplete="off"
                      value={form.hp} onChange={handleChange}
                      aria-hidden="true"
                      className="absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="c-nome" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formName')}</label>
                        <input id="c-nome" className={`input-base ${fieldState('nome')}`} type="text" name="nome" placeholder={t('formNamePlaceholder')} required value={form.nome} onChange={handleChange} onBlur={handleBlur} aria-invalid={fieldState('nome') === 'is-invalid'} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="c-email" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formEmail')}</label>
                        <input id="c-email" className={`input-base ${fieldState('email')}`} type="email" name="email" placeholder={t('formEmailPlaceholder')} required value={form.email} onChange={handleChange} onBlur={handleBlur} aria-invalid={fieldState('email') === 'is-invalid'} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="c-empresa" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formCompany')}</label>
                        <input id="c-empresa" className={`input-base ${fieldState('empresa')}`} type="text" name="empresa" placeholder={t('formCompanyPlaceholder')} value={form.empresa} onChange={handleChange} onBlur={handleBlur} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="c-telefone" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formPhone')}</label>
                        <input id="c-telefone" className={`input-base ${fieldState('telefone')}`} type="tel" name="telefone" placeholder={t('formPhonePlaceholder')} value={form.telefone} onChange={handleChange} onBlur={handleBlur} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="c-servico" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formService')}</label>
                      <div className="relative">
                        <select id="c-servico" className="input-base appearance-none cursor-pointer" name="servico" value={form.servico} onChange={handleChange}>
                          <option value="" className="bg-neutral-900">{t('formServicePlaceholder')}</option>
                          {serviceOptions.map((o) => <option key={o} value={o} className="bg-neutral-900 text-white">{o}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="c-mensagem" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formMessage')}</label>
                      <textarea id="c-mensagem" className={`input-base min-h-[130px] resize-none ${fieldState('mensagem')}`} name="mensagem" required placeholder={t('formMessagePlaceholder')} value={form.mensagem} onChange={handleChange} onBlur={handleBlur} aria-invalid={fieldState('mensagem') === 'is-invalid'} />
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-4 rounded-xl text-white font-bold text-base cursor-pointer border-0 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
                      style={{ background: 'var(--cyan)', boxShadow: '0 4px 20px rgba(234,88,12,0.25), inset 0 1px 1px rgba(255,255,255,0.2)' }}>
                      {loading ? (
                        <span>{t('formSubmitting')}</span>
                      ) : (
                        <>
                          <WhatsAppIcon size={16} color="#fff" />
                          <span>{t('formSubmit')}</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-neutral-500 leading-relaxed text-center -mt-1">
                      {t('formSubmitHint')}
                    </p>
                  </motion.form>
                )}

                {!submitted && mode === 'schedule' && !scheduledOk && (
                  <motion.div
                    key="schedule-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="cs-nome" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {t('formName')} <span className="text-orange-500/80">*</span>
                        </label>
                        <input
                          id="cs-nome"
                          className={`input-base ${fieldState('nome')}`}
                          type="text" name="nome" required
                          placeholder={t('formNamePlaceholder')}
                          value={form.nome} onChange={handleChange} onBlur={handleBlur}
                          aria-invalid={fieldState('nome') === 'is-invalid'}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="cs-email" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {t('formEmail')} <span className="text-orange-500/80">*</span>
                        </label>
                        <input
                          id="cs-email"
                          className={`input-base ${fieldState('email')}`}
                          type="email" name="email" required
                          placeholder={t('formEmailPlaceholder')}
                          value={form.email} onChange={handleChange} onBlur={handleBlur}
                          aria-invalid={fieldState('email') === 'is-invalid'}
                        />
                      </div>
                    </div>

                    <div
                      className={`flex items-start gap-2.5 text-[11px] sm:text-xs font-medium px-3.5 py-2.5 rounded-lg border transition-colors ${
                        canScheduleDirect
                          ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-500'
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      <CheckCircle size={14} className={`flex-shrink-0 mt-0.5 ${canScheduleDirect ? 'text-emerald-400' : 'text-neutral-600'}`} />
                      <span className="leading-snug">
                        {canScheduleDirect ? labels.scheduleReady : labels.scheduleHint}
                      </span>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
                      <CalEmbed
                        calLink={calPath}
                        locale={calLocale}
                        prefill={canScheduleDirect ? { name: form.nome.trim(), email: form.email.trim() } : undefined}
                        onBookingSuccessful={handleBookingSuccessful}
                      />
                    </div>

                    <a
                      href={calExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 mx-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-orange-500/30 hover:text-orange-400 hover:bg-neutral-800/60 transition-all no-underline"
                    >
                      <ExternalLink size={13} />
                      <span>{t('scheduleOpenExternal')}</span>
                    </a>
                  </motion.div>
                )}

                {!submitted && mode === 'schedule' && scheduledOk && (
                  <motion.div
                    key="schedule-success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 relative z-10"
                  >
                    <div className="flex justify-center mb-6">
                      <Calendar size={56} strokeWidth={1.5} className="text-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{t('scheduleSuccessTitle')}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed max-w-[380px] mx-auto mb-6">
                      {t('scheduleSuccessDesc')}
                    </p>
                    <button
                      type="button"
                      onClick={() => { setScheduledOk(false); setMode('message') }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition-all cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      <span>{t('scheduleSuccessBack')}</span>
                    </button>
                  </motion.div>
                )}

                {submitted && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 relative z-10"
                  >
                    <div className="flex justify-center mb-6">
                      <CheckCircle size={56} strokeWidth={1.5} className="text-orange-500 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{t('successTitle')}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed max-w-[340px] mx-auto mb-6">{t('successDesc')}</p>

                    {lastWaUrl && (
                      <a
                        href={lastWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: 'linear-gradient(135deg, #25d366, #128c7e)',
                          boxShadow: '0 4px 18px rgba(37, 211, 102, 0.35)',
                        }}
                      >
                        <WhatsAppIcon size={16} color="#fff" />
                        <span>{t('successWaFallback')}</span>
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
