'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Code2, Globe, Layers, Database, Workflow, Compass } from 'lucide-react'

const ICONS = [Code2, Globe, Layers, Database, Workflow, Compass]
const SLUGS = ['desenvolvimento', 'web-mobile', 'arquitetura', 'dados', 'integracoes', 'consultoria'] as const
const TAGS   = [
  ['React', 'Node.js', 'Python', 'TypeScript', 'Java', 'Kotlin', 'Spring'],
  ['Next.js', 'React Native', 'Flutter', 'PWA'],
  ['AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Serverless'],
  ['PostgreSQL', 'MongoDB', 'Redis', 'ETL'],
  ['REST API', 'Webhooks', 'RPA', 'n8n'],
  ['Code Review', 'Tech Audit', 'Cloud', 'DevOps'],
]

export default function Services() {
  const t      = useTranslations('Services')
  const locale = useLocale()
  const items  = t.raw('items') as Array<{ title: string; desc: string }>
  const localePath = locale === 'pt' ? '' : `/${locale}`

  return (
    <section id="servicos" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(232,75,26,0.09) 0%, transparent 60%)' }} />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div className="mb-12 sm:mb-16 max-w-[600px]"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}>
          <span className="tag-badge">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--cyan)' }} />
            {t('tag')}
          </span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-black tracking-tight leading-[1.15]">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden cursor-default">
              <div aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }} />
              <div aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, var(--cyan-dim) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 relative z-10"
                style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border-strong)' }}>
                {(() => { const Icon = ICONS[i]; return <Icon size={22} strokeWidth={1.75} color="var(--cyan)" /> })()}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 relative z-10">{s.title}</h3>
              <p className="text-sm leading-[1.7] relative z-10" style={{ color: 'var(--text-70)' }}>{s.desc}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5 relative z-10">
                {TAGS[i].map((tag) => <span key={tag} className="service-tag">{tag}</span>)}
              </div>
              <Link
                href={`${localePath}/servicos/${SLUGS[i]}` as never}
                className="inline-flex items-center gap-1.5 text-xs font-semibold mt-5 sm:mt-6 no-underline transition-all duration-300 relative z-10 group/link"
                style={{ color: 'var(--cyan)' }}
                aria-label={`${s.title}: ${t('learnMore')}`}
              >
                {t('learnMore')}
                <ArrowRight size={12} strokeWidth={2.2} className="transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
