'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Search, Layers, Code2, Settings } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { WHATSAPP_LINK } from '@/lib/constants'

const PROCESS_ICONS = [Search, Layers, Code2, Settings]

export default function Process() {
  const t     = useTranslations('Process')
  const steps = t.raw('steps') as Array<{ title: string; desc: string; highlight: string }>

  return (
    <section id="processo" className="py-20 sm:py-[100px] lg:py-[120px] relative overflow-hidden bg-neutral-950 border-t border-neutral-900">
      {/* Background decoration */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(249,115,22,0.08) 0%, transparent 60%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-950/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 relative z-10">
        <motion.div className="text-center mb-16 sm:mb-24"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="tag-badge">
            {t('tag')}
          </span>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight leading-[1.15] mt-4 mb-5 text-white">
            {t('title')} <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
          <p className="section-subtitle max-w-[520px] mx-auto text-neutral-400">{t('subtitle')}</p>
        </motion.div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative">
          
          {/* Connecting line in background (Desktop only) */}
          <div aria-hidden="true"
            className="absolute top-8 lg:top-10 xl:top-12 left-[12%] right-[12%] h-[2px] hidden lg:block bg-neutral-900"
          >
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            />
          </div>

          {steps.map((s, i) => {
            const Icon = PROCESS_ICONS[i]
            return (
              <motion.div 
                key={i} 
                className="flex flex-col items-start group relative cursor-default"
                initial={{ opacity: 0, y: 35 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} 
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                {/* Big Number ordinal at the top */}
                <div className="text-[3rem] sm:text-[4rem] xl:text-[5rem] font-black leading-none text-neutral-800/80 group-hover:text-orange-500/30 transition-colors duration-500 mb-3 select-none relative z-10">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon wrapper */}
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 border border-neutral-800/80 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-orange-500/30 group-hover:bg-orange-500/10">
                  <Icon size={18} className="text-orange-500" />
                </div>

                {/* Card details */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-orange-400 transition-colors duration-300">{s.title}</h3>
                  <p className="text-sm leading-[1.65] text-neutral-400 mb-4 group-hover:text-neutral-300 transition-colors duration-300">{s.desc}</p>
                  
                  {/* Highlight statement */}
                  <div className="text-xs font-bold text-orange-500/90 tracking-wide mt-auto pt-1">
                    {s.highlight}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom WhatsApp CTA button */}
        <motion.div 
          className="mt-20 text-center flex flex-col items-center gap-3.5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-white font-bold text-base no-underline transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'var(--cyan)',
              boxShadow: '0 4px 20px rgba(234, 88, 12, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
            }}
          >
            <WhatsAppIcon size={18} color="#fff" />
            <span>{t('cta')}</span>
          </a>
          <span className="text-xs text-neutral-500 tracking-wide">
            {t('subtext')}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
