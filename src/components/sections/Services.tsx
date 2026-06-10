'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Code2, Globe, Layers, Database, Workflow, Compass, ArrowRight } from 'lucide-react'

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

function ServiceCard({
  item,
  index,
  localePath,
  slug,
  tags,
  learnMoreText,
}: {
  item: { title: string; desc: string }
  index: number
  localePath: string
  slug: string
  tags: string[]
  learnMoreText: string
}) {
  const Icon = ICONS[index]
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group glass-card spotlight-card rounded-3xl p-8 sm:p-10 xl:p-12 relative overflow-hidden cursor-default border border-neutral-900 bg-neutral-900/35 backdrop-blur-sm transition-all duration-300 hover:bg-neutral-900/50 hover:shadow-[0_12px_40px_rgba(249,115,22,0.04)] flex flex-col h-full justify-between"
    >
      {/* Top glowing line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }}
      />

      {/* Content wrapper */}
      <div className="flex flex-col h-full">
        {/* Icon block */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:scale-105"
          style={{
            background: 'var(--cyan-dim)',
            border: '1px solid var(--border-strong)',
            boxShadow: hovered ? '0 0 15px rgba(194, 65, 12, 0.15)' : 'none',
          }}
        >
          <Icon size={22} strokeWidth={2} color="var(--cyan)" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold mb-3 relative z-10 text-white group-hover:text-orange-400 transition-colors duration-200">
          {item.title}
        </h3>
        <p className="text-sm leading-[1.7] relative z-10 mb-6" style={{ color: 'var(--text-70)' }}>
          {item.desc}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mt-auto relative z-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-neutral-950 text-neutral-400 border border-neutral-900 transition-all duration-300 group-hover:bg-orange-500/10 group-hover:text-orange-400 group-hover:border-orange-500/25"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`${localePath}/servicos/${slug}` as never}
          className="inline-flex items-center gap-1.5 text-xs font-bold mt-6 no-underline transition-all duration-300 relative z-10 group/link"
          style={{ color: 'var(--cyan)' }}
          aria-label={`${item.title}: ${learnMoreText}`}
        >
          <span>{learnMoreText}</span>
          <ArrowRight size={13} className="transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const t      = useTranslations('Services')
  const locale = useLocale()
  const items  = t.raw('items') as Array<{ title: string; desc: string }>
  const localePath = locale === 'pt' ? '' : `/${locale}`

  return (
    <section id="servicos" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden bg-neutral-950 border-t border-neutral-900">
      {/* Background gradients and visual points */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(194,65,12,0.04) 0%, transparent 60%)' }}
      />
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-orange-950/15 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-[640px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="tag-badge">
            {t('title')}
          </span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mt-4 mb-5 text-white">
            Foco técnico em <span className="gradient-text">soluções críticas</span>
          </h2>
          <p className="section-subtitle max-w-[520px] mx-auto text-base text-neutral-400 leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, i) => (
            <ServiceCard
              key={i}
              item={item}
              index={i}
              localePath={localePath}
              slug={SLUGS[i]}
              tags={TAGS[i]}
              learnMoreText={t('learnMore')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
