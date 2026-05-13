'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Building2, Landmark, BookOpen, BarChart3, Plane, Briefcase } from 'lucide-react'
import { FOUNDER_SITE } from '@/lib/constants'

const CASES = [
  { icon: BarChart3,  name: 'B3',                   tag: 'Mercado Financeiro',  desc: 'Microsserviços Java 8 + Angular 8 com Spring Cloud (Eureka, Ribbon, Config).' },
  { icon: Landmark,   name: 'Banco do Brasil',      tag: 'Bancário · PIX',       desc: 'Sistemas corporativos full-stack de suporte a transferências PIX/SPB.' },
  { icon: BookOpen,   name: 'PNLD · RNP',            tag: 'Educação',             desc: 'Distribuição de livros didáticos com Kotlin, Spring WebFlux e AWS SQS.' },
  { icon: Building2,  name: 'BEN Visa Vale',         tag: 'Fintech · Santander',  desc: 'Sistemas críticos de gestão de estabelecimentos com Java, React, Spring e Kafka.' },
  { icon: Plane,      name: 'Pluxee',                tag: 'Fintech Internacional',desc: 'Soluções serverless com Node.js, Java e AWS Lambda em alta disponibilidade.' },
  { icon: Briefcase,  name: 'AGEFIS · GDF',          tag: 'Governo',              desc: 'SISAF-GEO em Java/AngularJS/Hibernate, com app Android e impressão Zebra (ZPL).' },
]

export default function Cases() {
  const t = useTranslations('Cases')

  return (
    <section id="cases" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden" style={{ background: 'var(--bg-1)' }}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(232,75,26,0.07) 0%, transparent 60%)' }} />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div className="text-center mb-12 sm:mb-16 max-w-[640px] mx-auto"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CASES.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div key={c.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl p-5 sm:p-6 relative overflow-hidden group cursor-default"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                <div aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, var(--cyan-dim) 0%, transparent 60%)' }} />

                <div className="flex items-start gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--cyan-dim)', border: '1px solid var(--border-strong)' }}>
                    <Icon size={18} strokeWidth={1.75} color="var(--cyan)" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-tight">{c.name}</h3>
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider" style={{ color: 'var(--cyan)' }}>{c.tag}</span>
                  </div>
                </div>
                <p className="text-[0.85rem] leading-[1.6] relative z-10" style={{ color: 'var(--text-70)' }}>{c.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div className="mt-10 sm:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
          <a href={FOUNDER_SITE} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5"
            style={{ color: 'var(--cyan)', border: '1px solid var(--border-strong)', background: 'transparent' }}>
            {t('viewAll')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
