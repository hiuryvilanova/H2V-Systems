'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Mail, CheckCircle, MapPin, Send } from 'lucide-react'
import { WhatsAppIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { useToast } from '@/components/ui/Toast'
import { WHATSAPP_LINK, WHATSAPP_DISPLAY, EMAIL, LINKEDIN_URL, LOCATION } from '@/lib/constants'

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

  const inputClass = "w-full px-4 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-neutral-950"

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
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate className="relative z-10 flex flex-col gap-5">
                {/* Honeypot anti-spam */}
                <input
                  type="text" name="hp" tabIndex={-1} autoComplete="off"
                  value={form.hp} onChange={handleChange}
                  aria-hidden="true"
                  className="absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formName')}</label>
                    <input className={inputClass} type="text" name="nome" placeholder={t('formNamePlaceholder')} required value={form.nome} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formEmail')}</label>
                    <input className={inputClass} type="email" name="email" placeholder={t('formEmailPlaceholder')} required value={form.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formCompany')}</label>
                    <input className={inputClass} type="text" name="empresa" placeholder={t('formCompanyPlaceholder')} value={form.empresa} onChange={handleChange} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formPhone')}</label>
                    <input className={inputClass} type="tel" name="telefone" placeholder={t('formPhonePlaceholder')} value={form.telefone} onChange={handleChange} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formService')}</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none cursor-pointer`} name="servico" value={form.servico} onChange={handleChange}>
                      <option value="" className="bg-neutral-900">{t('formServicePlaceholder')}</option>
                      {serviceOptions.map((o) => <option key={o} value={o} className="bg-neutral-900 text-white">{o}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('formMessage')}</label>
                  <textarea className={`${inputClass} min-h-[130px] resize-none`} name="mensagem" required placeholder={t('formMessagePlaceholder')} value={form.mensagem} onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-bold text-base cursor-pointer border-0 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
                  style={{ background: 'var(--cyan)', boxShadow: '0 4px 20px rgba(234,88,12,0.25), inset 0 1px 1px rgba(255,255,255,0.2)' }}>
                  {loading ? (
                    <span>{t('formSubmitting')}</span>
                  ) : (
                    <>
                      <span>{t('formSubmit')}</span>
                      <Send size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-10 relative z-10">
                <div className="flex justify-center mb-6">
                  <CheckCircle size={56} strokeWidth={1.5} className="text-orange-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{t('successTitle')}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed max-w-[340px] mx-auto">{t('successDesc')}</p>
              </div>
            )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
