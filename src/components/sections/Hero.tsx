'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Zap, ShieldCheck, TrendingUp, Lock, ArrowRight } from 'lucide-react'
import ParticlesCanvas from '@/components/ui/ParticlesCanvas'

const stagger  = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const fadeUp   = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }

export default function Hero() {
  const t     = useTranslations('Hero')

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  const badges = [
    { icon: Zap,         label: t('badgePerformance')  },
    { icon: ShieldCheck, label: t('badgeArchitecture') },
    { icon: TrendingUp,  label: t('badgeScalability')  },
    { icon: Lock,        label: t('badgeSecurity')     },
  ]

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen min-h-[100svh] flex items-center overflow-hidden bg-[var(--bg-0)]">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 z-0 pointer-events-none" />

      {/* Tech networking particles */}
      <ParticlesCanvas showLinks={true} soft density="sparse" />

      <motion.div aria-hidden="true" className="absolute inset-[-20%] z-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: `
          radial-gradient(ellipse 72% 58% at 50% 42%, rgba(249,115,22,0.08) 0%, transparent 58%),
          radial-gradient(ellipse 48% 42% at 22% 72%, rgba(15,23,42,0.3) 0%, transparent 52%),
          radial-gradient(ellipse 38% 32% at 78% 78%, rgba(239,68,68,0.05) 0%, transparent 50%)
        `}} />
      </motion.div>

      {/* Animated floating gradient orbs */}
      <div aria-hidden="true" className="gradient-orb gradient-orb-1 w-[500px] h-[500px] -top-40 -right-40 animate-float" style={{ animationDuration: '6s' }} />
      <div aria-hidden="true" className="gradient-orb gradient-orb-2 w-[400px] h-[400px] -bottom-32 -left-32 animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }} />

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10 w-full min-w-0">
        <motion.div className="pt-[max(6.5rem,calc(6.5rem+env(safe-area-inset-top,0px)))] sm:pt-[max(8.5rem,calc(8.5rem+env(safe-area-inset-top,0px)))] pb-16 sm:pb-24 max-w-[820px] xl:max-w-[1000px] min-w-0 mx-auto text-center" style={{ y: contentY }} variants={stagger} initial="hidden" animate="visible">

          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-float">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>{t('badgeTop')}</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-[clamp(2.25rem,7vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-5 sm:mb-6 break-words text-white">
            {t('title')}
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-red-500 bg-clip-text text-transparent">{t('titleAccent')}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[0.98rem] sm:text-[1.12rem] leading-[1.75] max-w-[36rem] xl:max-w-[44rem] mb-8 sm:mb-10 mx-auto" style={{ color: 'var(--text-70)' }}>
            {t('description')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-3 sm:gap-4 flex-wrap justify-center items-center">
            <a href="#contato"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-white font-semibold text-sm no-underline transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group animate-glow-pulse"
              style={{ background: 'var(--cyan)', boxShadow: '0 4px 20px rgba(194,65,12,0.3), inset 0 1px 1px rgba(255,255,255,0.2)' }}>
              <span>{t('ctaPrimary')}</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
            </a>
            <a href="#servicos"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm no-underline transition-all duration-300 bg-transparent hover:bg-white/5 hover:scale-[1.03] active:scale-[0.98]"
              style={{ color: 'var(--text-100)', border: '1px solid var(--border-strong)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              {t('ctaSecondary')}
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-10 sm:gap-y-5">
            {badges.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.label} className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-neutral-400 transition-colors duration-300 hover:text-white group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-neutral-900/50 border border-neutral-800 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={16} strokeWidth={2} className="text-orange-500" />
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
