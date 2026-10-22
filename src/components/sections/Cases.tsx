'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FOUNDER_SITE } from '@/lib/constants'
import { ArrowUpRight, Landmark, Banknote, CreditCard, BookOpen, Building2, MapPinned } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type CaseItem = {
  id: string
  orgKey: string
  viaKey: string
  roleKey: string
  sectorKey: string
  descKey: string
  tagKey: string
  icon: LucideIcon
}

/**
 * Trajetória profissional pública do fundador (hiuryvilanova.com).
 * Nomes são uso nominativo para descrever onde ele atuou como
 * desenvolvedor — não são clientes da H2V e não usamos logotipo.
 */
const CASES: CaseItem[] = [
  { id: 'market',   orgKey: 'orgMarket',   viaKey: 'viaRedspark', roleKey: 'roleAnalyst',  sectorKey: 'sectorMarket',   descKey: 'descMarket',   tagKey: 'tagMarket',   icon: Landmark   },
  { id: 'banking',  orgKey: 'orgBanking',  viaKey: 'viaCast',     roleKey: 'roleDev',      sectorKey: 'sectorBanking',  descKey: 'descBanking',  tagKey: 'tagBanking',  icon: Banknote   },
  { id: 'edu',      orgKey: 'orgEdu',      viaKey: 'viaRedspark', roleKey: 'roleAnalyst',  sectorKey: 'sectorEdu',      descKey: 'descEdu',      tagKey: 'tagEdu',      icon: BookOpen   },
  { id: 'benefits', orgKey: 'orgBenefits', viaKey: 'viaRedspark', roleKey: 'roleAnalystSr', sectorKey: 'sectorBenefits', descKey: 'descBenefits', tagKey: 'tagBenefits', icon: CreditCard },
  { id: 'fintech',  orgKey: 'orgFintech',  viaKey: 'viaRedspark', roleKey: 'roleAnalystSr', sectorKey: 'sectorFintech',  descKey: 'descFintech',  tagKey: 'tagFintech',  icon: Building2  },
  { id: 'govgeo',   orgKey: 'orgGovGeo',   viaKey: 'viaGdf',      roleKey: 'roleDevJava',  sectorKey: 'sectorGovGeo',   descKey: 'descGovGeo',   tagKey: 'tagGovGeo',   icon: MapPinned  },
]

export default function Cases() {
  const t = useTranslations('Cases')

  return (
    <section id="cases" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden bg-neutral-950 border-t border-neutral-900">
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-orange-950/15 blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-[640px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="tag-badge">{t('title')}</span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mt-4 mb-5 text-white">
            {t('headlineLead')} <span className="gradient-text">{t('headlineAccent')}</span>
          </h2>
          <p className="section-subtitle max-w-[520px] mx-auto text-base text-neutral-300">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CASES.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl p-8 sm:p-10 xl:p-12 relative overflow-hidden bg-neutral-900/35 border border-neutral-900 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/25 hover:bg-neutral-900/50 hover:shadow-[0_12px_40px_rgba(194,65,12,0.04)] flex flex-col h-full justify-between"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(194,65,12,0.04) 0%, transparent 60%)' }}
                />

                <div className="flex flex-col h-full relative z-10 justify-between">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      aria-hidden="true"
                      className="h-12 w-12 rounded-xl flex items-center justify-center bg-neutral-950 border border-neutral-800 group-hover:border-orange-500/30 group-hover:bg-neutral-900 transition-all duration-300"
                    >
                      <Icon size={20} className="text-orange-400" strokeWidth={1.75} />
                    </div>
                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md bg-neutral-950 text-neutral-300 group-hover:text-orange-400 group-hover:bg-orange-500/10 transition-colors duration-300 shrink-0">
                      {t(c.tagKey)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-1 text-white group-hover:text-orange-400 transition-colors duration-200">
                    {t(c.orgKey)}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-3">
                    {t(c.roleKey)} · {t(c.viaKey)}
                  </p>
                  <p className="text-sm font-medium text-neutral-200 mb-2">{t(c.sectorKey)}</p>
                  <p className="text-sm leading-[1.65] text-neutral-300 group-hover:text-neutral-200 transition-colors duration-200">
                    {t(c.descKey)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Disclaimer legal: experiências do fundador, não contratos H2V Systems */}
        <motion.p
          className="mt-10 sm:mt-12 text-center text-xs leading-relaxed text-neutral-400 max-w-[720px] mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {t('disclaimer')}
        </motion.p>

        <motion.div
          className="mt-10 sm:mt-12 text-center"
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
