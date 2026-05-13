'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function Faq() {
  const t     = useTranslations('Faq')
  const faqs  = t.raw('items') as Array<{ q: string; a: string }>
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 sm:py-[100px] lg:py-[120px]" style={{ background: 'var(--bg-1)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
            <span className="tag-badge">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--cyan)' }} />
              {t('tag')}
            </span>
            <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-black tracking-tight leading-tight mb-4">
              {t('title')}<br />
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h2>
            <p className="section-subtitle mb-6 sm:mb-8">{t('subtitle')}</p>

            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h4 className="text-base sm:text-lg font-bold mb-2">{t('noAnswerTitle')}</h4>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-70)' }}>{t('noAnswerDesc')}</p>
              <a href="#contato"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-lg text-white font-semibold text-sm no-underline hover:-translate-y-0.5 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, var(--cyan), var(--blue))', boxShadow: '0 4px 24px rgba(232,75,26,0.45)' }}>
                {t('noAnswerCta')}
              </a>
            </div>
          </motion.div>

          {/* Right — accordion */}
          <motion.div className="flex flex-col gap-3" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
            {faqs.map((faq, i) => {
              const isOpen = open === i
              return (
                <div key={i} className="rounded-2xl overflow-hidden transition-colors duration-300"
                  style={{ background: 'var(--bg-card)', border: `1px solid ${isOpen ? 'var(--border-strong)' : 'var(--border)'}` }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex justify-between items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 text-left font-semibold text-sm cursor-pointer bg-transparent border-0 transition-colors duration-300"
                    style={{ color: isOpen ? 'var(--cyan)' : 'var(--text-100)' }}>
                    <span className="flex-1">{faq.q}</span>
                    <span className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center text-xl font-light transition-all duration-300 flex-shrink-0"
                      style={{ background: isOpen ? 'var(--cyan)' : 'var(--cyan-dim)', color: isOpen ? 'var(--bg-0)' : 'var(--cyan)', border: '1px solid var(--border)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div key="body" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                        <div className="px-5 sm:px-6 pb-5 text-sm leading-[1.75]" style={{ color: 'var(--text-70)' }}>{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
