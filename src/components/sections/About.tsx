'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Target, Eye, Gem } from 'lucide-react'

export default function About() {
  const t = useTranslations('About')

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  const values = [
    { icon: Target, title: t('missionTitle'), desc: t('missionDesc') },
    { icon: Eye,    title: t('visionTitle'),  desc: t('visionDesc')  },
    { icon: Gem,    title: t('valuesTitle'),  desc: t('valuesDesc')  },
  ]

  return (
    <section id="sobre" ref={sectionRef} className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden" style={{ background: 'var(--bg-1)' }}>
      <motion.div aria-hidden="true" className="absolute inset-[-20%] pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(194,65,12,0.045) 0%, transparent 60%)' }} />
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75 }}>
            <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mb-5 sm:mb-6">
              {t('title')}<br />
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h2>

            <p className="text-[0.95rem] leading-[1.8] mb-4" style={{ color: 'var(--text-70)' }}>
              {t.rich('p1', {
                strong: (chunks) => <strong style={{ color: 'var(--text-100)' }}>{chunks}</strong>,
              })}
            </p>
            <p className="text-[0.95rem] leading-[1.8]" style={{ color: 'var(--text-70)' }}>
              {t.rich('p2', {
                cyan: (chunks) => <strong style={{ color: 'var(--cyan)' }}>{chunks}</strong>,
              })}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col gap-4">
              {values.map((v) => {
                const Icon = v.icon
                return (
                <div key={v.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 min-w-[40px] rounded-lg flex items-center justify-center mt-0.5"
                    style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border)' }}>
                    <Icon size={18} strokeWidth={1.75} color="var(--cyan)" />
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-semibold mb-1">{v.title}</h4>
                    <p className="text-[0.85rem] leading-[1.65]" style={{ color: 'var(--text-70)' }}>{v.desc}</p>
                  </div>
                </div>
                )
              })}
            </div>
          </motion.div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75 }}
              className="about-terminal rounded-2xl p-4 sm:p-7 relative overflow-hidden">
              <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }} />
              <div className="flex gap-2 mb-5">
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                  <span key={c} className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />
                ))}
              </div>
              <pre className="text-[0.7rem] sm:text-[0.82rem] leading-[1.7] sm:leading-[1.8] overflow-x-auto whitespace-pre font-mono" style={{ color: 'var(--text-70)' }}>
                <span className="c-cm">{'// H2V Systems — Core Philosophy\n\n'}</span>
                <span className="c-kw">{'const '}</span><span className="c-var">{'h2v'}</span>{' = {\n'}
                {'  founder:  '}<span className="c-str">{"'Hiury Vilanova'"}</span>{',\n'}
                {'  mission:  '}<span className="c-str">{"'Build digital foundations'"}</span>{',\n'}
                {'  stack:    [\n    '}<span className="c-str">{"'Java'"}</span>{', '}<span className="c-str">{"'Kotlin'"}</span>{', '}<span className="c-str">{"'Spring'"}</span>{',\n    '}<span className="c-str">{"'React'"}</span>{', '}<span className="c-str">{"'Node'"}</span>{', '}<span className="c-str">{"'AWS'"}</span>{', '}<span className="c-str">{"'Cloud'"}</span>{'\n  ],\n'}
                {'  values:   [\n    '}<span className="c-str">{"'transparency'"}</span>{',\n    '}<span className="c-str">{"'excellence'"}</span>{',\n    '}<span className="c-str">{"'client_success'"}</span>{',\n  ],\n\n  '}
                <span className="c-fn">{'deliver'}</span>{'(project) {\n    '}<span className="c-kw">{'return'}</span>{' project\n      .plan().build()\n      .test().deploy('}<span className="c-str">{"'production'"}</span>{');\n  }\n};\n\n'}
                <span className="c-cm">{'// Powering digital foundations'}</span>
              </pre>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75, delay: 0.15 }}
              className="glass-card rounded-2xl p-5 sm:p-6">
              <h4 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--cyan)' }}>
                {t('founderLabel')}
              </h4>
              <p className="text-sm leading-[1.65]" style={{ color: 'var(--text-70)' }}>
                <strong style={{ color: 'var(--text-100)' }}>Hiury Vilanova</strong>. {t('founderDesc')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
