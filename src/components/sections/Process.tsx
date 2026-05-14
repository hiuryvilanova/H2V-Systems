'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function Process() {
  const t     = useTranslations('Process')
  const steps = t.raw('steps') as Array<{ title: string; desc: string }>

  return (
    <section id="processo" data-surface="brand" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 55%)' }} />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="tag-badge" style={{ margin: '0 auto 20px' }}>
            {t('tag')}
          </span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15]">
            {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
          </h2>
          <p className="section-subtitle max-w-[500px] mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative">
          <div aria-hidden="true"
            className="absolute top-7 left-[12.5%] right-[12.5%] h-px hidden lg:block"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }} />

          {steps.map((s, i) => (
            <motion.div key={i} className="text-center px-2 sm:px-4"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold mx-auto mb-5 sm:mb-6 relative z-10"
                style={{ background: 'var(--bg-1)', border: '2px solid var(--cyan)', color: 'var(--cyan)', boxShadow: '0 0 20px var(--cyan-glow)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h4 className="text-base font-bold mb-2.5">{s.title}</h4>
              <p className="text-[0.85rem] leading-[1.65]" style={{ color: 'var(--text-70)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
