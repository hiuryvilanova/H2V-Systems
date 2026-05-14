'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Mail, CheckCircle, MapPin } from 'lucide-react'
import { WhatsAppIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { useToast } from '@/components/ui/Toast'
import { WHATSAPP_LINK, WHATSAPP_DISPLAY, EMAIL, LINKEDIN_URL, LOCATION } from '@/lib/constants'

const inputBase: React.CSSProperties = {
  background: 'var(--bg-0)', border: '1px solid var(--border)', borderRadius: '8px',
  color: 'var(--text-100)', padding: '12px 16px', fontSize: '16px',
  outline: 'none', width: '100%', fontFamily: 'inherit',
  transition: 'border-color 0.3s, box-shadow 0.3s',
}
const focusStyle = (el: HTMLElement) => { el.style.borderColor = 'var(--cyan)'; el.style.boxShadow = '0 0 0 3px var(--cyan-dim)' }
const blurStyle  = (el: HTMLElement) => { el.style.borderColor = 'var(--border)'; el.style.boxShadow = 'none' }

export default function Contact() {
  const t = useTranslations('Contact')
  const toast = useToast()
  const serviceOptions = t.raw('servicesOptions') as string[]

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const [form, setForm] = useState({ nome: '', email: '', empresa: '', telefone: '', servico: '', mensagem: '', hp: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome || !form.email || !form.mensagem) {
      toast.error(t('formErrorRequired'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error(t('formErrorEmail'))
      return
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

  type IconCmp = (props: { size?: number; strokeWidth?: number; color?: string }) => React.ReactElement
  const channels: Array<{ icon: IconCmp; brand?: boolean; label: string; value: string; href?: string }> = [
    { icon: WhatsAppIcon as IconCmp, brand: true,  label: t('channelWaLabel'),       value: WHATSAPP_DISPLAY,          href: WHATSAPP_LINK },
    { icon: Mail as unknown as IconCmp,            label: t('channelEmailLabel'),     value: EMAIL,                     href: `mailto:${EMAIL}` },
    { icon: LinkedInIcon as IconCmp, brand: true,  label: t('channelLinkedinLabel'),  value: t('channelLinkedinValue'), href: LINKEDIN_URL },
    { icon: MapPin as unknown as IconCmp,          label: t('channelLocationLabel'),  value: LOCATION                                                  },
  ]

  return (
    <section id="contato" ref={sectionRef} className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden">
      <motion.div aria-hidden="true" className="absolute inset-[-20%] pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: `
          radial-gradient(ellipse 60% 50% at 70% 50%, rgba(194,65,12,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 20% 30%, rgba(255,120,60,0.07) 0%, transparent 50%)
        `}} />
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          className="mb-8 sm:mb-10 lg:mb-12 max-w-[640px]"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.65 }}>
          <span className="tag-badge">{t('tag')}</span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mb-4">
            {t('title')}<br />
            <span className="gradient-text">{t('titleHighlight')}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-10 sm:gap-12 lg:gap-14 items-start">

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
            <p className="text-sm leading-[1.75] mb-8 sm:mb-10" style={{ color: 'var(--text-70)' }}>{t('description')}</p>

            <div className="flex flex-col gap-3 sm:gap-4">
              {channels.map((ch) => {
                const Icon = ch.icon
                const baseClass = 'flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl no-underline transition-all duration-300'
                const interactiveClass = ch.href ? 'hover:translate-x-1' : ''
                const iconProps = ch.brand ? { size: 18, color: 'var(--cyan)' } : { size: 18, strokeWidth: 1.75, color: 'var(--cyan)' }
                const inner = (
                  <>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border)' }}>
                      <Icon {...iconProps} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs" style={{ color: 'var(--text-70)' }}>{ch.label}</span>
                      <strong className="text-sm block break-words hyphens-auto">{ch.value}</strong>
                    </div>
                  </>
                )
                const style: React.CSSProperties = { background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--border)', color: 'var(--text-100)' }
                return ch.href ? (
                  <a key={ch.label} href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className={`${baseClass} ${interactiveClass}`} style={style}>
                    {inner}
                  </a>
                ) : (
                  <div key={ch.label} className={baseClass} style={style}>{inner}</div>
                )
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div className="w-full min-w-0 lg:sticky lg:top-28 self-start"
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
            <div className="glass-card rounded-3xl p-6 sm:p-8 h-full">
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot anti-spam: invisível ao usuário, bot preenche */}
                <input
                  type="text" name="hp" tabIndex={-1} autoComplete="off"
                  value={form.hp} onChange={handleChange}
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-70)' }}>{t('formName')}</label>
                    <input style={inputBase} type="text" name="nome" placeholder={t('formNamePlaceholder')} required value={form.nome} onChange={handleChange}
                      onFocus={(e) => focusStyle(e.target)} onBlur={(e) => blurStyle(e.target)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-70)' }}>{t('formEmail')}</label>
                    <input style={inputBase} type="email" name="email" placeholder={t('formEmailPlaceholder')} required value={form.email} onChange={handleChange}
                      onFocus={(e) => focusStyle(e.target)} onBlur={(e) => blurStyle(e.target)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-70)' }}>{t('formCompany')}</label>
                    <input style={inputBase} type="text" name="empresa" placeholder={t('formCompanyPlaceholder')} value={form.empresa} onChange={handleChange}
                      onFocus={(e) => focusStyle(e.target)} onBlur={(e) => blurStyle(e.target)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium" style={{ color: 'var(--text-70)' }}>{t('formPhone')}</label>
                    <input style={inputBase} type="tel" name="telefone" placeholder={t('formPhonePlaceholder')} value={form.telefone} onChange={handleChange}
                      onFocus={(e) => focusStyle(e.target)} onBlur={(e) => blurStyle(e.target)} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-70)' }}>{t('formService')}</label>
                  <select style={{ ...inputBase, appearance: 'none', WebkitAppearance: 'none' }} name="servico" value={form.servico} onChange={handleChange}
                    onFocus={(e) => focusStyle(e.target)} onBlur={(e) => blurStyle(e.target)}>
                    <option value="">{t('formServicePlaceholder')}</option>
                    {serviceOptions.map((o) => <option key={o} style={{ background: 'var(--bg-card)' }}>{o}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2 mb-6">
                  <label className="text-xs font-medium" style={{ color: 'var(--text-70)' }}>{t('formMessage')}</label>
                  <textarea style={{ ...inputBase, minHeight: '120px', resize: 'none' }} name="mensagem" required placeholder={t('formMessagePlaceholder')} value={form.mensagem} onChange={handleChange}
                    onFocus={(e) => focusStyle(e.target)} onBlur={(e) => blurStyle(e.target)} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-lg text-white font-semibold text-base cursor-pointer border-0 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                  style={{ background: 'var(--cyan)', boxShadow: '0 8px 28px rgba(194,65,12,0.2)' }}>
                  {loading ? t('formSubmitting') : t('formSubmit')}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={52} strokeWidth={1.5} color="var(--cyan)" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('successTitle')}</h3>
                <p className="text-sm" style={{ color: 'var(--text-70)' }}>{t('successDesc')}</p>
              </div>
            )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
