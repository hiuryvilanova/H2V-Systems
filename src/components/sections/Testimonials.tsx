'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Quote } from 'lucide-react'

export default function Testimonials() {
  const t = useTranslations('Testimonials')
  const items = t.raw('items') as Array<{ quote: string; author: string; role: string }>

  return (
    <section id="depoimentos" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(232,75,26,0.06) 0%, transparent 60%)' }} />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div className="text-center mb-12 sm:mb-16 max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}>
          <span className="tag-badge" style={{ margin: '0 auto 18px' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--cyan)' }} />
            {t('tag')}
          </span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-black tracking-tight leading-[1.15]">
            {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
          </h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, i) => (
            <motion.figure key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative flex flex-col">

              <Quote
                size={28}
                strokeWidth={1.5}
                color="var(--cyan)"
                className="opacity-60 mb-4"
                aria-hidden="true"
              />

              <blockquote className="text-[0.95rem] leading-[1.7] mb-6 flex-1" style={{ color: 'var(--text-100)' }}>
                {item.quote}
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                  style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border-strong)', color: 'var(--cyan)' }}>
                  {item.author.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{item.author}</div>
                  <div className="text-xs" style={{ color: 'var(--text-70)' }}>{item.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
