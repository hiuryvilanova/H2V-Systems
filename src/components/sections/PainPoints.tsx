'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { AlertTriangle, ShieldCheck, HelpCircle, Activity, Zap, Users } from 'lucide-react'

const PAIN_ICONS = [Users, Activity, HelpCircle, Zap]

export default function PainPoints() {
  const t = useTranslations('PainPoints')
  const items = t.raw('items') as Array<{ pain: string; solution: string }>

  return (
    <section id="dores" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden bg-neutral-950">
      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-orange-950/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-red-950/10 blur-[130px] pointer-events-none" />

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16 sm:mb-24 max-w-[640px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="tag-badge">
            {t('tag')}
          </span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mt-4 mb-5 text-white">
            {t('title')} <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
          <p className="section-subtitle max-w-[500px] mx-auto text-neutral-400">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 2x2 Grid of Pain vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 xl:gap-10">
          {items.map((item, i) => {
            const Icon = PAIN_ICONS[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group rounded-3xl p-8 sm:p-10 xl:p-12 bg-neutral-900/35 border border-neutral-900 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:border-orange-500/25 hover:bg-neutral-900/50 hover:shadow-[0_12px_40px_rgba(249,115,22,0.04)]"
              >
                {/* Visual grid connector dot */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-neutral-800 transition-colors duration-300 group-hover:bg-orange-500/30" />

                <div className="flex flex-col gap-6 relative z-10 h-full justify-between">
                  {/* Common Pain Row */}
                  <div className="flex gap-4 items-start pb-5 border-b border-neutral-900/60">
                    <div className="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                      <Icon size={18} className="text-red-500/80" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('commonProblem')}</h4>
                      <h3 className="text-base sm:text-lg xl:text-xl font-bold text-neutral-200 mt-1">{item.pain}</h3>
                    </div>
                  </div>

                  {/* H2V Engineering Solution Row */}
                  <div className="flex gap-4 items-start pt-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10">
                      <ShieldCheck size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80">{t('solution')}</h4>
                      <p className="text-sm sm:text-base leading-relaxed text-neutral-400 xl:text-[1.05rem] mt-1 group-hover:text-neutral-300 transition-colors duration-300">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
