'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FOUNDER_SITE } from '@/lib/constants'
import { ArrowUpRight } from 'lucide-react'

type CaseLogo =
  | { type: 'single'; src: string }
  | { type: 'stack'; src: [string, string] }

const CASES: {
  name: string
  tag: string
  desc: string
  logo: CaseLogo
}[] = [
  {
    name: 'B3',
    tag: 'Mercado Financeiro',
    desc: 'Arquitetura de microsserviços Java com Spring Cloud e Angular para mensageria crítica de clearing.',
    logo: { type: 'single', src: '/cases/b3.png' },
  },
  {
    name: 'Banco do Brasil',
    tag: 'Bancário · PIX',
    desc: 'Sistemas corporativos distribuídos de alta performance para conciliação e suporte de fluxos PIX/SPB.',
    logo: { type: 'single', src: '/cases/banco-do-brasil.svg' },
  },
  {
    name: 'PNLD · RNP',
    tag: 'Educação / Governo',
    desc: 'Pipeline escalável de distribuição logística com Kotlin, Spring WebFlux e processamento distribuído na AWS.',
    logo: { type: 'single', src: '/cases/rnp.jpg' },
  },
  {
    name: 'BEN Visa Vale',
    tag: 'Fintech · Santander',
    desc: 'Sistemas de alta disponibilidade com Java, React e mensageria Apache Kafka para controle financeiro de cartões de benefício.',
    logo: { type: 'stack', src: ['/cases/santander.svg', '/cases/visa.svg'] },
  },
  {
    name: 'Pluxee',
    tag: 'Fintech Internacional',
    desc: 'Modelagem de microsserviços serverless na AWS com Node.js e Java para processamento de transações sob demanda.',
    logo: { type: 'single', src: '/cases/pluxee.svg' },
  },
  {
    name: 'AGEFIS · GDF',
    tag: 'Geoprocessamento',
    desc: 'Modernização do SISAF-GEO com Java, Angular e integrações mobile nativas com suporte offline e relatórios de campo.',
    logo: { type: 'single', src: '/cases/brasao-df.svg' },
  },
]

function CaseLogoMedia({ name, logo, hovered }: { name: string; logo: CaseLogo; hovered: boolean }) {
  const alt = `Logo da empresa ${name}`
  const filterClass = `max-w-full max-h-full w-auto h-auto object-contain transition-all duration-500 ${
    hovered ? 'scale-[1.06]' : 'scale-100'
  }`

  if (logo.type === 'stack') {
    const [a, b] = logo.src
    return (
      <div className="flex items-center gap-3 justify-center w-full h-full min-h-0 px-1">
        <img
          src={a}
          alt=""
          className={`h-5 w-auto max-w-[45%] object-contain transition-all duration-500 ${
            hovered ? 'scale-[1.06]' : 'scale-100'
          }`}
          aria-hidden
        />
        <span className="w-px h-4 bg-neutral-300" />
        <img
          src={b}
          alt=""
          className={`h-5 w-auto max-w-[45%] object-contain transition-all duration-500 ${
            hovered ? 'scale-[1.06]' : 'scale-100'
          }`}
          aria-hidden
        />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    <img
      src={logo.src}
      alt={alt}
      className={filterClass}
      loading="lazy"
      decoding="async"
    />
  )
}

export default function Cases() {
  const t = useTranslations('Cases')
  const [activeHover, setActiveHover] = useState<string | null>(null)

  return (
    <section id="cases" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden bg-neutral-950 border-t border-neutral-900">
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-orange-950/15 blur-[120px] pointer-events-none" />

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
            Cases de <span className="gradient-text">engenharia complexa</span>
          </h2>
          <p className="section-subtitle max-w-[500px] mx-auto text-base text-neutral-400">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CASES.map((c, i) => {
            const isHovered = activeHover === c.name
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                onMouseEnter={() => setActiveHover(c.name)}
                onMouseLeave={() => setActiveHover(null)}
                whileHover={{ y: -6 }}
                className="group rounded-3xl p-8 sm:p-10 xl:p-12 relative overflow-hidden bg-neutral-900/35 border border-neutral-900 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/25 hover:bg-neutral-900/50 hover:shadow-[0_12px_40px_rgba(194,65,12,0.04)] flex flex-col h-full justify-between"
              >
                {/* Spotlight background */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(194,65,12,0.04) 0%, transparent 60%)' }}
                />

                <div className="flex flex-col h-full relative z-10 justify-between">
                  {/* Top Header Area: Logo + Meta */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className={`h-12 px-4 rounded-xl flex items-center justify-center transition-all duration-300 min-w-[5.5rem] ${
                        c.name === 'PNLD · RNP'
                          ? 'bg-neutral-950 border border-neutral-900 group-hover:bg-neutral-900 group-hover:border-orange-500/20'
                          : 'bg-white border border-neutral-200 group-hover:border-orange-500/20'
                      }`}
                    >
                      <CaseLogoMedia name={c.name} logo={c.logo} hovered={isHovered} />
                    </div>
                    <span
                      className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md bg-neutral-950 text-neutral-400 group-hover:text-orange-400 group-hover:bg-orange-500/10 transition-colors duration-300 shrink-0"
                    >
                      {c.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-3 text-white group-hover:text-orange-400 transition-colors duration-200">
                    {c.name}
                  </h3>
                  <p className="text-sm leading-[1.65] text-neutral-400 group-hover:text-neutral-300 transition-colors duration-200">
                    {c.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a
            href={FOUNDER_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold no-underline transition-all duration-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:scale-[1.02] active:scale-[0.98]"
            style={{ color: 'var(--cyan)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
          >
            <span>{t('viewAll')}</span>
            <ArrowUpRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
