'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Zap, ShieldCheck, TrendingUp, Lock } from 'lucide-react'
import ParticlesCanvas from '@/components/ui/ParticlesCanvas'

const stagger  = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }
const fadeUp   = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } } }

export default function Hero() {
  const t     = useTranslations('Hero')

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  const badges = [
    { icon: Zap,         label: t('badgePerformance')  },
    { icon: ShieldCheck, label: t('badgeArchitecture') },
    { icon: TrendingUp,  label: t('badgeScalability')  },
    { icon: Lock,        label: t('badgeSecurity')     },
  ]

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen min-h-[100svh] flex items-center overflow-hidden bg-white">
      <ParticlesCanvas showLinks={false} soft density="sparse" />

      <motion.div aria-hidden="true" className="absolute inset-[-20%] z-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: `
          radial-gradient(ellipse 72% 58% at 50% 42%, rgba(194,65,12,0.055) 0%, transparent 58%),
          radial-gradient(ellipse 48% 42% at 22% 72%, rgba(15,23,42,0.035) 0%, transparent 52%),
          radial-gradient(ellipse 38% 32% at 78% 78%, rgba(15,23,42,0.025) 0%, transparent 50%)
        `}} />
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10 w-full min-w-0">
        <motion.div className="pt-[max(5.5rem,calc(5.5rem+env(safe-area-inset-top,0px)))] sm:pt-[max(7.5rem,calc(7.5rem+env(safe-area-inset-top,0px)))] pb-16 sm:pb-24 max-w-[800px] min-w-0 mx-auto text-center" style={{ y: contentY }} variants={stagger} initial="hidden" animate="visible">

          <motion.h1 variants={fadeUp} className="text-[clamp(2rem,7vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] mb-5 sm:mb-6 break-words text-[var(--text-100)]">
            {t('title')}
            <br />
            <span className="text-[var(--cyan)]">{t('titleAccent')}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[0.95rem] sm:text-[1.0625rem] leading-[1.72] max-w-[34rem] mb-8 sm:mb-10 mx-auto" style={{ color: 'var(--text-70)' }}>
            {t('description')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-3 sm:gap-4 flex-wrap justify-center">
            <a href="#contato"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-md text-white font-semibold text-sm no-underline transition-all duration-200 hover:opacity-95"
              style={{ background: 'var(--cyan)', boxShadow: '0 1px 2px rgba(15,23,42,0.06), 0 8px 24px rgba(194,65,12,0.22)' }}>
              {t('ctaPrimary')}
            </a>
            <a href="#servicos"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-md font-semibold text-sm no-underline transition-colors duration-200 bg-white"
              style={{ color: 'var(--text-100)', border: '1px solid var(--border-strong)' }}>
              {t('ctaSecondary')}
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-x-5 gap-y-4 sm:gap-x-8 sm:gap-y-5">
            {badges.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.label} className="flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-70)' }}>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-[var(--bg-1)] border border-[var(--border)]">
                    <Icon size={15} strokeWidth={1.75} color="var(--text-70)" />
                  </div>
                  <span className="leading-snug">{b.label}</span>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
