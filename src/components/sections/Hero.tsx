'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Zap, ShieldCheck, TrendingUp, Lock } from 'lucide-react'
import ParticlesCanvas from '@/components/ui/ParticlesCanvas'
import { WHATSAPP_LINK } from '@/lib/constants'

function useTyping(words: string[]) {
  const [text,      setText]      = useState('')
  const [wordIdx,   setWordIdx]   = useState(0)
  const [charIdx,   setCharIdx]   = useState(0)
  const [deleting,  setDeleting]  = useState(false)

  useEffect(() => {
    if (!words.length) return
    const word = words[wordIdx] ?? ''
    let timer: ReturnType<typeof setTimeout>

    if (!deleting) {
      if (charIdx < word.length) {
        timer = setTimeout(() => { setText(word.slice(0, charIdx + 1)); setCharIdx((i) => i + 1) }, 80)
      } else {
        timer = setTimeout(() => setDeleting(true), 2200)
      }
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => { setText(word.slice(0, charIdx - 1)); setCharIdx((i) => i - 1) }, 40)
      } else {
        setDeleting(false)
        setWordIdx((i) => (i + 1) % words.length)
      }
    }
    return () => clearTimeout(timer)
  }, [charIdx, deleting, wordIdx, words])

  return text
}

const stagger  = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }
const fadeUp   = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } } }

export default function Hero() {
  const t     = useTranslations('Hero')
  const words = t.raw('words') as string[]

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const typedText = useTyping(words)

  const badges = [
    { icon: Zap,         label: t('badgePerformance')  },
    { icon: ShieldCheck, label: t('badgeArchitecture') },
    { icon: TrendingUp,  label: t('badgeScalability')  },
    { icon: Lock,        label: t('badgeSecurity')     },
  ]

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <ParticlesCanvas />

      <motion.div aria-hidden="true" className="absolute inset-[-20%] z-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: `
          radial-gradient(ellipse 80% 60% at 60% 40%, rgba(232,75,26,0.22) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 20% 70%, rgba(255,120,60,0.10) 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 80% 80%, rgba(191,56,8,0.14) 0%, transparent 50%)
        `}} />
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10 w-full">
        <motion.div className="pt-[100px] sm:pt-[130px] pb-16 sm:pb-24 max-w-[800px]" style={{ y: contentY }} variants={stagger} initial="hidden" animate="visible">

          <motion.p variants={fadeUp} className="font-mono text-[0.7rem] sm:text-[0.78rem] font-medium uppercase tracking-[0.12em] sm:tracking-[0.15em] mb-5 sm:mb-6 opacity-80" style={{ color: 'var(--cyan)' }}>
            {t('eyebrow')}
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-[clamp(2rem,8vw,5rem)] font-black leading-[1.05] tracking-[-0.04em] mb-5 sm:mb-6 break-words">
            {t('title')}
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #FF6B35, var(--cyan), var(--blue))' }}>
              {typedText || '\u00A0'}
            </span>
            <span className="animate-blink" style={{ color: 'var(--cyan)' }}>|</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[0.95rem] sm:text-[1.1rem] leading-[1.7] sm:leading-[1.75] max-w-[560px] mb-8 sm:mb-10" style={{ color: 'var(--text-70)' }}>
            {t('description')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-3 sm:gap-4 flex-wrap">
            <a href="#contato"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-lg text-white font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, var(--cyan), var(--blue))', boxShadow: '0 4px 24px rgba(232,75,26,0.45)' }}>
              {t('ctaPrimary')}
            </a>
            <a href="#servicos"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-lg font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
              style={{ color: 'var(--cyan)', border: '1px solid var(--border-strong)', background: 'transparent' }}>
              {t('ctaSecondary')}
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
            {badges.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.label} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium" style={{ color: 'var(--text-70)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border)' }}>
                    <Icon size={15} strokeWidth={2} color="var(--cyan)" />
                  </div>
                  <span className="leading-tight">{b.label}</span>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 z-10 flex flex-col items-center gap-2 animate-bounce-down text-xs tracking-[0.1em]" style={{ color: 'var(--text-40)' }}>
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, var(--cyan), transparent)' }} />
        <span>{t('scroll')}</span>
      </div>
    </section>
  )
}
